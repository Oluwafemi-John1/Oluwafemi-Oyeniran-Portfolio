import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeminiLiveService {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private stream: MediaStream | null = null;
  private inputSampleRate: number = 0;
  
  // Status Signals
  public isConnected: WritableSignal<boolean> = signal(false);
  public isSpeaking: WritableSignal<boolean> = signal(false);
  public volume: WritableSignal<number> = signal(0);
  public error: WritableSignal<string | null> = signal(null);

  // Explicitly pointing to the v1alpha endpoint for experimental models
  private readonly MODEL = 'models/gemini-2.0-flash-exp';
  private readonly HOST = 'generativelanguage.googleapis.com';
  private readonly PATH = '/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent';

  constructor() {}

  async connect(apiKey: string, systemInstruction: string) {
    if (this.isConnected()) return;

    try {
      // 1. Initialize Audio Context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000
      });
      this.inputSampleRate = this.audioContext.sampleRate;

      // 2. Setup WebSocket
      const url = `wss://${this.HOST}${this.PATH}?key=${apiKey}`;
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.isConnected.set(true);
        this.error.set(null);
        this.sendSetupMessage(systemInstruction);
        this.startAudioInput();
      };

      this.ws.onmessage = async (event) => {
        await this.handleMessage(event.data);
      };

      this.ws.onclose = (ev) => {
        console.log('WebSocket Closed:', ev.code, ev.reason);
        this.disconnect();
      };

      this.ws.onerror = (err) => {
        console.error('WebSocket Error:', err);
        this.error.set('Connection Error. Please check API Key.');
        this.disconnect();
      };

    } catch (err) {
      this.error.set('Failed to initialize audio or connection');
      console.error(err);
    }
  }

  disconnect() {
    this.isConnected.set(false);
    this.isSpeaking.set(false);
    
    // Stop Audio
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    // Close WS
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private sendSetupMessage(instruction: string) {
    if (!this.ws) return;
    
    // Simplest working config for v1alpha/gemini-2.0-flash-exp
    const setupMsg = {
      setup: {
        model: this.MODEL,
        generation_config: {
          response_modalities: ["AUDIO"]
        },
        system_instruction: {
          parts: [{ text: instruction }]
        }
      }
    };
    
    this.ws.send(JSON.stringify(setupMsg));
  }

  private async startAudioInput() {
    if (!this.audioContext) return;
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioContext.createMediaStreamSource(this.stream);
      
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.calculateVolume(inputData);
        
        const pcm16 = this.downsampleTo16k(inputData, this.inputSampleRate);
        const base64 = this.arrayBufferToBase64(pcm16.buffer);
        
        this.sendAudioChunk(base64);
      };

      source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      
    } catch (err) {
      this.error.set('Microphone access denied');
      this.disconnect();
    }
  }

  private sendAudioChunk(base64: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const msg = {
      realtime_input: {
        media_chunks: [{
          mime_type: "audio/pcm;rate=16000",
          data: base64
        }]
      }
    };
    
    this.ws.send(JSON.stringify(msg));
  }

  private async handleMessage(data: any) {
      if (data instanceof Blob) {
          return;
      }
      
      try {
          const response = JSON.parse(data);
          
          if (response.server_content?.model_turn?.parts?.[0]?.inline_data) {
              const inlineData = response.server_content.model_turn.parts[0].inline_data;
              if (inlineData.mime_type.startsWith('audio/pcm')) {
                  this.playAudioResponse(inlineData.data);
              }
          }
          
          if (response.server_content?.turn_complete) {
              this.isSpeaking.set(false);
          }
      } catch (e) {
          console.error('Error parsing message', e);
      }
  }

  private playAudioResponse(base64Data: string) {
      if (!this.audioContext) return;
      
      this.isSpeaking.set(true);
      
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
      }
      
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      
      for(let i=0; i<int16.length; i++) {
          float32[i] = int16[i] / 32768.0;
      }
      
      const buffer = this.audioContext.createBuffer(1, float32.length, 24000);
      buffer.getChannelData(0).set(float32);
      
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      source.start();
      
      source.onended = () => {
          // Stream continues
      };
  }

  private calculateVolume(data: Float32Array) {
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
          sum += data[i] * data[i];
      }
      const rms = Math.sqrt(sum / data.length);
      const current = this.volume();
      this.volume.set(current * 0.8 + (rms * 5) * 0.2); 
  }

  private downsampleTo16k(buffer: Float32Array, inputRate: number): Int16Array {
      if (inputRate === 16000) {
          const res = new Int16Array(buffer.length);
          for(let i=0; i<buffer.length; i++) res[i] = Math.max(-1, Math.min(1, buffer[i])) * 0x7FFF;
          return res;
      }
      
      const ratio = inputRate / 16000;
      const newLength = Math.round(buffer.length / ratio);
      const result = new Int16Array(newLength);
      
      for (let i = 0; i < newLength; i++) {
          const offset = Math.floor(i * ratio);
          let sum = 0;
          let count = 0;
          const end = Math.floor((i + 1) * ratio);
          for(let j = offset; j < end && j < buffer.length; j++) {
              sum += buffer[j];
              count++;
          }
          const avg = count > 0 ? sum / count : buffer[offset];
          result[i] = Math.max(-1, Math.min(1, avg)) * 0x7FFF;
      }
      
      return result;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
  }
}