import { Component, ChangeDetectionStrategy, AfterViewInit, ViewChild, ElementRef, inject, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GeminiLiveService } from '../../app/services/gemini-live.service';

declare var gsap: any;

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="overflow-hidden h-screen w-full relative bg-[#0F172A] text-slate-200 font-display">
      <!-- Background Effects -->
      <div class="fixed inset-0 z-0 constellation-bg pointer-events-none opacity-30"></div>
      
      <div class="relative z-50 flex h-full w-full items-end justify-center pt-12">
        <div class="glass-panel w-full max-w-7xl h-[94%] rounded-t-[32px] overflow-hidden flex flex-col shadow-2xl translate-y-full opacity-0" #panel>
          
          <header class="shrink-0 flex items-center justify-between px-6 md:px-8 py-6 border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-xl sticky top-0 z-30">
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-3">
                <span class="text-accent font-code text-xs tracking-[0.2em] uppercase">The Proof // Case Study</span>
                <span class="h-px w-8 bg-accent/30"></span>
                <span class="text-slate-500 font-code text-[10px] tracking-widest uppercase">Oyeniran Oluwafemi</span>
              </div>
              <h2 class="text-2xl md:text-4xl font-display font-bold text-white tracking-tight">Fiscal Entropy Monitor</h2>
            </div>
            
            <div class="flex items-center gap-4">
              <!-- Voice Uplink Button -->
              <button (click)="toggleVoice()" class="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 hover:bg-accent/10 transition-all cursor-pointer group">
                <span class="material-symbols-outlined text-accent group-hover:scale-110 transition-transform">mic_none</span>
                <span class="text-xs font-code text-accent uppercase tracking-widest font-bold">Voice Uplink</span>
              </button>

              <a routerLink="/projects" class="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-accent/40 hover:bg-accent/5 transition-all duration-500 cursor-pointer">
                <span class="material-symbols-outlined text-slate-400 group-hover:text-accent transition-colors scale-90">close</span>
              </a>
            </div>
          </header>

          <main class="flex-1 overflow-y-auto custom-scrollbar relative">
            <div class="p-8 lg:p-12 max-w-6xl mx-auto flex flex-col gap-16">
              <!-- Metrics -->
              <section class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div class="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="glass-card p-6 rounded-2xl flex flex-col gap-2 group hover:border-accent/20 transition-all metric-card opacity-0">
                    <span class="text-xs font-code text-slate-500 uppercase tracking-widest">Throughput</span>
                    <span class="text-4xl font-display font-bold text-white tracking-tighter group-hover:text-accent transition-colors">10k <span class="text-lg font-light text-slate-500">TPS</span></span>
                  </div>
                  <div class="glass-card p-6 rounded-2xl flex flex-col gap-2 group hover:border-accent/20 transition-all metric-card opacity-0">
                    <span class="text-xs font-code text-slate-500 uppercase tracking-widest">Integrity</span>
                    <span class="text-4xl font-display font-bold text-white tracking-tighter group-hover:text-accent transition-colors">99.9<span class="text-lg font-light text-slate-500">%</span></span>
                  </div>
                  <div class="glass-card p-6 rounded-2xl flex flex-col gap-2 group hover:border-accent/20 transition-all metric-card opacity-0">
                    <span class="text-xs font-code text-slate-500 uppercase tracking-widest">Latency</span>
                    <span class="text-4xl font-display font-bold text-white tracking-tighter group-hover:text-accent transition-colors">50<span class="text-lg font-light text-slate-500">ms</span></span>
                  </div>
                </div>
                <div class="flex flex-col gap-4 metric-card opacity-0">
                  <span class="text-[10px] font-code text-slate-500 uppercase tracking-[0.2em] font-bold">Protocol Stack</span>
                  <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 rounded-md bg-accent/10 border border-accent/20 text-accent font-code text-[11px]">[Angular]</span>
                    <span class="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 font-code text-[11px]">[RxJS]</span>
                    <span class="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 font-code text-[11px]">[D3.js]</span>
                    <span class="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 font-code text-[11px]">[Node.js]</span>
                  </div>
                </div>
              </section>

              <!-- Content -->
              <section class="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div class="lg:col-span-5 flex flex-col gap-8 content-block opacity-0 translate-y-8">
                  <div class="flex items-center gap-4">
                    <div class="w-1 h-8 bg-accent glow-accent"></div>
                    <h3 class="text-2xl font-display font-bold text-white uppercase tracking-wider">The Problem</h3>
                  </div>
                  <div class="space-y-6 text-slate-400 font-body leading-relaxed text-lg">
                    <p>
                        Modern financial dashboards often suffer from <span class="text-white italic">"rendering fatigue."</span> When tracking capital flow across thousands of active nodes in real-time, the DOM becomes a critical bottleneck.
                    </p>
                    <p>
                        Oyeniran Oluwafemi was tasked with building a sovereign financial ledger capable of visualizing entropy—the chaotic dispersal of funds—without the typical 2-second lag found in traditional enterprise software.
                    </p>
                  </div>
                </div>
                
                <div class="lg:col-span-7 flex flex-col gap-10 content-block opacity-0 translate-y-8">
                   <div class="flex items-center gap-4">
                     <div class="w-1 h-8 bg-accent/40"></div>
                     <h3 class="text-2xl font-display font-bold text-white uppercase tracking-wider">The Architecture</h3>
                   </div>
                   
                   <!-- Code Block -->
                   <div class="rounded-xl overflow-hidden border border-white/10 bg-[#2E3440] shadow-2xl">
                     <div class="flex items-center justify-between px-5 py-3 bg-[#3B4252] border-b border-white/5">
                       <span class="text-[11px] font-code text-slate-400">algorithm_entropy_stream.ts</span>
                       <div class="flex gap-1.5">
                         <div class="w-2.5 h-2.5 rounded-full bg-[#BF616A]/50"></div>
                         <div class="w-2.5 h-2.5 rounded-full bg-[#EBCB8B]/50"></div>
                         <div class="w-2.5 h-2.5 rounded-full bg-[#A3BE8C]/50"></div>
                       </div>
                     </div>
                     <div class="p-6 overflow-x-auto">
                       <pre class="font-code text-sm leading-7 text-slate-300"><code><span class="text-indigo-300">private</span> <span class="text-cyan-300">setupStream</span>(): <span class="text-indigo-300">void</span> {{ '{' }}
  <span class="text-indigo-300">this</span>.socket$.<span class="text-cyan-300">pipe</span>(
    <span class="text-cyan-300">bufferTime</span>(<span class="text-purple-300">500</span>), <span class="text-slate-500 italic">// Batch updates for performance</span>
    <span class="text-cyan-300">filter</span>(batch => batch.length > <span class="text-purple-300">0</span>),
    <span class="text-cyan-300">map</span>(batch => <span class="text-indigo-300">this</span>.<span class="text-cyan-300">processEntropy</span>(batch)),
    <span class="text-cyan-300">tap</span>(data => {{ '{' }}
      <span class="text-slate-500 italic">// Decouple from Angular zone</span>
      <span class="text-indigo-300">this</span>.ngZone.<span class="text-cyan-300">runOutsideAngular</span>(() => {{ '{' }}
        <span class="text-indigo-300">this</span>.chart.<span class="text-cyan-300">updateNodes</span>(data);
      {{ '}' }});
    {{ '}' }})
  ).<span class="text-cyan-300">subscribe</span>();
{{ '}' }}</code></pre>
                     </div>
                   </div>
                </div>
              </section>
              
              <footer class="pt-16 pb-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                 <div class="flex flex-col gap-1">
                   <span class="text-[10px] font-code text-slate-500 uppercase tracking-[0.3em]">Architected by</span>
                   <span class="text-white font-display font-bold tracking-widest uppercase">Oyeniran Oluwafemi</span>
                 </div>
              </footer>

            </div>

            <!-- Live Interface Overlay -->
             @if (showVoiceInterface) {
                <div class="absolute inset-0 z-40 bg-[#0F172A]/90 backdrop-blur-2xl flex flex-col items-center justify-center fade-in">
                    <button (click)="toggleVoice()" class="absolute top-8 right-8 text-slate-400 hover:text-white">
                        <span class="material-symbols-outlined text-3xl">close</span>
                    </button>

                    <div class="relative flex flex-col items-center gap-8">
                        <!-- Holographic Orb -->
                        <div class="relative w-48 h-48 flex items-center justify-center">
                            <div class="absolute inset-0 rounded-full border border-accent/20 animate-[spin_10s_linear_infinite]"></div>
                            <div class="absolute inset-2 rounded-full border border-accent/10 animate-[spin_15s_linear_infinite_reverse]"></div>
                            
                            <!-- Active Core -->
                            <div class="w-32 h-32 rounded-full bg-accent/5 backdrop-blur-sm border border-accent/20 shadow-[0_0_50px_rgba(56,189,248,0.2)] flex items-center justify-center relative overflow-hidden transition-all duration-300"
                                 [style.transform]="'scale(' + (1 + liveService.volume()) + ')'"
                                 [class.bg-accent-20]="liveService.isConnected()">
                                
                                <div class="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent opacity-50"></div>
                                
                                @if (!liveService.isConnected()) {
                                    <span class="material-symbols-outlined text-4xl text-accent/50 animate-pulse">wifi_tethering_off</span>
                                } @else {
                                    <span class="material-symbols-outlined text-4xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">graphic_eq</span>
                                }
                            </div>
                            
                            <!-- Rings -->
                             <div class="absolute inset-0 rounded-full border border-accent/30 opacity-0 scale-50"
                                  [class.animate-ping-slow]="liveService.isSpeaking()"></div>
                        </div>

                        <div class="text-center space-y-2">
                             <h3 class="text-2xl font-display font-bold text-white tracking-widest uppercase">
                                {{ liveService.isConnected() ? 'Neural Link Active' : 'Establishing Link...' }}
                             </h3>
                             <p class="text-slate-400 font-mono text-xs uppercase tracking-widest">
                                {{ liveService.isSpeaking() ? 'Incoming Transmission...' : 'Listening for input' }}
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
      </div>
    </div>
  `,
  styles: [`
    .glass-panel {
        background: rgba(30, 41, 59, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .glass-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .constellation-bg {
        background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0);
        background-size: 48px 48px;
    }
    .glow-accent {
        box-shadow: 0 0 20px rgba(56, 189, 248, 0.15);
    }
    .fade-in {
        animation: fadeIn 0.5s ease-out forwards;
    }
    .animate-ping-slow {
        animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetailComponent implements AfterViewInit, OnDestroy {
  @ViewChild('panel') panel!: ElementRef;
  
  public liveService = inject(GeminiLiveService);
  public showVoiceInterface = false;

  private projectContext = `
    You are the AI assistant for Oyeniran Oluwafemi's portfolio. You are currently discussing the project "Fiscal Entropy Monitor".
    
    Here are the technical details of the project:
    - **Goal**: Visualize financial capital flow across thousands of nodes in real-time without DOM lag.
    - **Key Metric**: 10k Transactions Per Second (TPS), 99.9% Integrity, 50ms Latency.
    - **Tech Stack**: Angular (Frontend), RxJS (State/Streams), D3.js (Visualization), Node.js (Backend).
    - **Architecture Highlights**: 
      - Uses WebSocket buffering (bufferTime 500ms).
      - Runs D3 updates outside the Angular Zone (ngZone.runOutsideAngular) to prevent change detection thrashing.
      - Implements an algorithm called "entropy_stream" to calculate chaotic dispersal.
    
    Answer questions about this project briefly and professionally, acting as the system architect.
  `;

  ngAfterViewInit() {
    const tl = gsap.timeline();
    
    tl.to(this.panel.nativeElement, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out'
    })
    .to('.metric-card', {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
    }, '-=0.3')
    .to('.content-block', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
    }, '-=0.2');
  }

  toggleVoice() {
    this.showVoiceInterface = !this.showVoiceInterface;
    
    if (this.showVoiceInterface) {
        // Connect to Gemini Live
        this.liveService.connect(process.env['API_KEY']!, this.projectContext);
    } else {
        this.liveService.disconnect();
    }
  }

  ngOnDestroy() {
      this.liveService.disconnect();
  }
}