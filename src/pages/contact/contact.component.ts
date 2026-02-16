import { Component, ChangeDetectionStrategy, AfterViewInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeminiLiveService } from '../../app/services/gemini-live.service';

declare var gsap: any;

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen relative bg-background-dark text-slate-200 font-body overflow-x-hidden selection:bg-primary selection:text-terminal">
      <!-- Header -->
      <header class="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 opacity-0 -translate-y-full" id="header">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div class="flex items-center gap-4 cursor-pointer" routerLink="/">
            <div class="size-9 text-primary">
              <span class="material-symbols-outlined text-[36px] font-light">hub</span>
            </div>
            <div class="flex flex-col">
              <h1 class="font-display font-bold text-xl tracking-tight leading-none text-white uppercase">Oyeniran Oluwafemi</h1>
              <span class="font-mono text-[11px] text-primary tracking-[0.25em] uppercase font-medium">Software Engineer</span>
            </div>
          </div>
          <nav class="hidden md:flex items-center gap-10">
            <a routerLink="/" class="text-slate-400 hover:text-primary transition-colors text-sm font-medium font-display tracking-widest">THE VOID</a>
            <a routerLink="/projects" class="text-slate-400 hover:text-primary transition-colors text-sm font-medium font-display tracking-widest">PROJECTS</a>
            <a routerLink="/writing" class="text-slate-400 hover:text-primary transition-colors text-sm font-medium font-display tracking-widest">WRITING</a>
            <a href="javascript:void(0)" class="text-white text-sm font-bold font-display tracking-widest relative">
                CONTACT
                <span class="absolute -bottom-2 left-0 w-full h-[2px] bg-primary shadow-[0_0_12px_#38BDF8]"></span>
            </a>
          </nav>
        </div>
      </header>

      <main class="relative flex min-h-screen w-full flex-col items-center justify-center pt-24 pb-12 px-6">
        <!-- Background Orbs & Grid -->
        <div class="fixed inset-0 pointer-events-none z-0">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[160px]"></div>
          <div class="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.05)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_90%)]"></div>
          
          <svg class="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <line stroke="#38BDF8" stroke-width="0.5" x1="10%" x2="20%" y1="15%" y2="80%"></line>
            <line stroke="#38BDF8" stroke-width="0.5" x1="15%" x2="70%" y1="25%" y2="90%"></line>
            <line stroke="#38BDF8" stroke-width="0.5" x1="10%" x2="85%" y1="15%" y2="25%"></line>
          </svg>
        </div>

        <div class="relative z-10 w-full max-w-[640px]">
          <div class="mb-10 text-center opacity-0 scale-95" id="title-block">
            <h2 class="font-display text-5xl md:text-6xl font-bold mb-4 tracking-tighter text-white">The Interface</h2>
            <div class="flex items-center justify-center gap-3">
              <span class="w-8 h-px bg-primary/40"></span>
              <p class="text-primary font-mono text-xs uppercase tracking-[0.3em] font-semibold">Secure P2P Channel Established</p>
              <span class="w-8 h-px bg-primary/40"></span>
            </div>
          </div>

          <!-- Terminal Window -->
          <div class="w-full bg-[#020617] rounded-lg overflow-hidden border border-slate-800 terminal-glow transition-all duration-500 hover:border-primary/30 opacity-0 translate-y-10" id="terminal">
            <div class="h-12 bg-[#0F172A] border-b border-slate-800 flex items-center px-4 md:px-5 justify-between select-none">
              <div class="flex items-center gap-2.5">
                <div class="size-3 rounded-full bg-[#FF5F56]"></div>
                <div class="size-3 rounded-full bg-[#FFBD2E]"></div>
                <div class="size-3 rounded-full bg-[#27C93F]"></div>
              </div>
              
              <div class="hidden md:flex text-slate-400 font-mono text-[11px] items-center gap-2 tracking-wider">
                <span class="material-symbols-outlined text-[14px]">terminal</span>
                COMM_PORTAL — 1024x768
              </div>

              <!-- Voice Toggle -->
              <button (click)="toggleVoice()" class="flex items-center gap-2 px-3 py-1 rounded bg-accent/10 hover:bg-accent/20 border border-accent/20 transition-all group cursor-pointer">
                  <span class="material-symbols-outlined text-[14px] text-accent group-hover:animate-pulse">mic</span>
                  <span class="text-[10px] text-accent font-mono tracking-wider font-bold">VOICE_UPLINK</span>
              </button>
            </div>

            <div class="p-8 font-mono text-sm md:text-base leading-relaxed text-slate-300 min-h-[420px] flex flex-col relative">
              <div class="absolute inset-0 scanline pointer-events-none z-20 opacity-[0.03]"></div>
              
              <div class="mb-8 space-y-1">
                <div class="flex items-center gap-3">
                  <span class="text-primary font-bold">user&#64;femi:~$</span>
                  <span class="text-white">init_contact_sequence --recipient="Oyeniran Oluwafemi"</span>
                </div>
                <div class="pl-4 border-l border-primary/20 mt-3 space-y-1 text-xs text-slate-500 italic">
                  <p>[sys] Synchronizing neural bridge...</p>
                  <p>[sys] Destination verified: Oyeniran Oluwafemi // Lead Architect</p>
                  <p>[sys] Encryption level: Quantum-Resistant AES-512</p>
                </div>
              </div>

              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-6 grow">
                <div class="flex flex-col md:flex-row md:items-baseline gap-3">
                  <label class="text-primary font-bold whitespace-nowrap min-w-[150px]" for="subject">&gt; subject_header:</label>
                  <input formControlName="subject" autocomplete="off" class="w-full bg-transparent border-none p-0 text-white placeholder-slate-700 focus:ring-0 font-mono text-base focus:outline-none" id="subject" placeholder="[Type message subject here]" type="text"/>
                </div>
                
                <div class="flex flex-col gap-3 grow">
                  <label class="text-primary font-bold" for="message">&gt; message_body:</label>
                  <textarea formControlName="message" class="w-full grow min-h-[150px] bg-transparent border-none p-0 text-white placeholder-slate-700 focus:ring-0 font-mono text-base resize-none focus:outline-none" id="message" placeholder="Awaiting input..."></textarea>
                </div>

                <div class="mt-4 pt-6 border-t border-slate-800/50 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="text-primary font-bold">&gt;</span>
                    <button class="group flex items-center gap-2 focus:outline-none" type="submit" [disabled]="contactForm.invalid">
                      <span class="bg-primary text-terminal font-bold px-3 py-1 text-xs tracking-tighter transition-all group-hover:bg-white group-hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] cursor-pointer">SEND [ENTER]</span>
                      <span class="terminal-cursor animate-pulse"></span>
                    </button>
                  </div>
                  <div class="hidden md:block text-[10px] text-slate-600 tracking-[0.2em] font-mono">
                     STATUS: AWAIT_INPUT
                  </div>
                </div>
              </form>
            </div>

            <div class="bg-[#0F172A] border-t border-slate-800 py-2 px-5 flex justify-between items-center text-[10px] text-slate-500 font-mono tracking-[0.2em] uppercase">
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_#38BDF8]"></span> ENCRYPTED</span>
                <span>LATENCY: 14ms</span>
              </div>
              <span class="text-primary font-bold">V.2.4.0-CORE</span>
            </div>
          </div>

          <!-- Social Links -->
          <div class="mt-12 flex flex-col items-center gap-6 opacity-0 translate-y-6" id="social-links">
             <div class="flex items-center gap-4">
               <div class="h-px w-12 bg-white/10"></div>
               <span class="font-mono text-[10px] text-slate-500 tracking-[0.3em] uppercase">Secure Uplinks</span>
               <div class="h-px w-12 bg-white/10"></div>
             </div>

             <div class="flex items-center gap-6">
               <a href="https://github.com" target="_blank" class="group relative p-3 rounded-full bg-slate-800/30 border border-white/5 hover:bg-slate-800/80 hover:border-primary/50 transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                  <svg class="w-5 h-5 fill-slate-400 group-hover:fill-white transition-colors" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                  <div class="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </a>
               
               <a href="https://linkedin.com" target="_blank" class="group relative p-3 rounded-full bg-slate-800/30 border border-white/5 hover:bg-slate-800/80 hover:border-primary/50 transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                  <svg class="w-5 h-5 fill-slate-400 group-hover:fill-white transition-colors" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  <div class="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </a>

               <a href="https://twitter.com" target="_blank" class="group relative p-3 rounded-full bg-slate-800/30 border border-white/5 hover:bg-slate-800/80 hover:border-primary/50 transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                  <svg class="w-5 h-5 fill-slate-400 group-hover:fill-white transition-colors" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                  <div class="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </a>
             </div>
          </div>
        </div>

        <!-- Voice Interface Overlay -->
        @if (showVoiceInterface) {
            <div class="fixed inset-0 z-50 bg-[#0F172A]/90 backdrop-blur-2xl flex flex-col items-center justify-center fade-in">
                <button (click)="toggleVoice()" class="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors">
                    <span class="material-symbols-outlined text-4xl">close</span>
                </button>

                <div class="relative flex flex-col items-center gap-10">
                    <!-- Holographic Orb -->
                    <div class="relative w-64 h-64 flex items-center justify-center">
                        <div class="absolute inset-0 rounded-full border border-accent/20 animate-[spin_10s_linear_infinite]"></div>
                        <div class="absolute inset-4 rounded-full border border-accent/10 animate-[spin_15s_linear_infinite_reverse]"></div>
                        
                        <!-- Active Core -->
                        <div class="w-40 h-40 rounded-full bg-accent/5 backdrop-blur-sm border border-accent/20 shadow-[0_0_60px_rgba(56,189,248,0.2)] flex items-center justify-center relative overflow-hidden transition-all duration-300"
                             [style.transform]="'scale(' + (1 + liveService.volume()) + ')'"
                             [class.bg-accent-20]="liveService.isConnected()">
                            
                            <div class="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent opacity-50"></div>
                            
                            @if (!liveService.isConnected()) {
                                <span class="material-symbols-outlined text-5xl text-accent/50 animate-pulse">wifi_tethering_off</span>
                            } @else {
                                <span class="material-symbols-outlined text-5xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">graphic_eq</span>
                            }
                        </div>
                        
                        <!-- Rings -->
                         <div class="absolute inset-0 rounded-full border border-accent/30 opacity-0 scale-50"
                              [class.animate-ping-slow]="liveService.isSpeaking()"></div>
                    </div>

                    <div class="text-center space-y-3">
                         <h3 class="text-3xl font-display font-bold text-white tracking-widest uppercase">
                            {{ liveService.isConnected() ? 'Comms Link Active' : 'Initializing Uplink...' }}
                         </h3>
                         <p class="text-slate-400 font-mono text-sm uppercase tracking-widest">
                            {{ liveService.isSpeaking() ? 'Receiving Transmission...' : 'Listening on secure channel' }}
                         </p>
                         @if (liveService.error()) {
                             <p class="text-red-400 font-mono text-xs">{{ liveService.error() }}</p>
                         }
                    </div>
                </div>
            </div>
         }
      </main>
    </div>
  `,
  styles: [`
    .glass-panel {
        background: rgba(30, 41, 59, 0.7);
        backdrop-filter: blur(12px);
    }
    .terminal-glow {
        box-shadow: 0 0 40px rgba(56, 189, 248, 0.15);
    }
    .terminal-cursor {
        width: 10px;
        height: 18px;
        background-color: #38BDF8;
        display: inline-block;
        vertical-align: middle;
    }
    .scanline {
        background: linear-gradient(
            to bottom,
            rgba(18, 16, 16, 0) 50%,
            rgba(0, 0, 0, 0.1) 50%
        );
        background-size: 100% 4px;
    }
    .animate-ping-slow {
        animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    .fade-in {
        animation: fadeIn 0.5s ease-out forwards;
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent implements AfterViewInit, OnDestroy {
  contactForm: FormGroup;
  public liveService = inject(GeminiLiveService);
  showVoiceInterface = false;

  private contactContext = `You are the Communications Officer AI for Oyeniran Oluwafemi's portfolio.
  You are currently active on the Contact Interface page.
  
  Your primary directives:
  1. Assist visitors who want to get in touch with Oyeniran.
  2. Answer questions about his availability for work, his technical stack (Angular, GSAP, Node.js, AI Integration), and his background.
  3. If they ask about specific projects, summarize them briefly and suggest they visit the Projects page for deep dives.
  4. Maintain a professional, highly intelligent, slightly futuristic/sci-fi persona consistent with the "Void" theme of this portfolio.
  5. If the user asks for email, provide it as "contact[at]oyeniran.dev" (or similar placeholder).
  
  Oyeniran is a Senior Software Engineer specializing in high-fidelity frontend experiences and scalable backend architectures.
  `;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    const tl = gsap.timeline();
    
    tl.to('#header', { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
      .to('#title-block', { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.4')
      .to('#terminal', { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .to('#social-links', { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4');
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Sending transmission:', this.contactForm.value);
      // Logic for sending
    }
  }

  toggleVoice() {
    this.showVoiceInterface = !this.showVoiceInterface;
    
    if (this.showVoiceInterface) {
        // Connect to Gemini Live with Contact Context
        this.liveService.connect(process.env['API_KEY']!, this.contactContext);
    } else {
        this.liveService.disconnect();
    }
  }

  ngOnDestroy() {
      this.liveService.disconnect();
  }
}