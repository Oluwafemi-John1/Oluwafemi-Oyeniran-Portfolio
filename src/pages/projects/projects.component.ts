import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, ChangeDetectionStrategy, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

declare var gsap: any;

interface ProjectNode {
  id: string;
  label: string; // Text for the ring
  role: string;
  icon: string;
  x: number; // Desktop X %
  y: number; // Desktop Y %
  mobileX: number; // Mobile X %
  mobileY: number; // Mobile Y %
}

interface Connection {
  from: number; // Index of start node
  to: number; // Index of end node
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-[#0F172A] text-white font-display overflow-hidden h-screen w-screen relative selection:bg-accent selection:text-[#0F172A]">
      <!-- Background Grid & Stars -->
      <div class="fixed inset-0 z-0 bg-grid-pattern opacity-[0.15] pointer-events-none"></div>
      <div class="fixed inset-0 z-0 pointer-events-none" #starsContainer></div>
      
      <!-- System Status (Top Right) -->
      <div class="fixed top-6 right-6 md:top-10 md:right-10 z-40 flex flex-col items-end gap-2 pointer-events-none opacity-0" #sysStatus>
        <div class="flex items-center gap-3">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
            <span class="text-[10px] md:text-[11px] font-mono text-accent tracking-[0.2em] font-bold">SYS.ENGINEER: OYENIRAN</span>
        </div>
        <span class="text-[10px] md:text-[11px] font-mono text-slate-500 tracking-widest">LOC: LAGOS_NODE // 6.5244° N</span>
        <span class="text-[10px] md:text-[11px] font-mono text-slate-500 tracking-widest">Uptime: 99.98%</span>
        
        <!-- Active Nodes Counter -->
        <div class="mt-2 flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded-sm bg-[#0F172A]/80 backdrop-blur-sm shadow-lg">
             <span class="material-symbols-outlined text-[12px] text-accent animate-pulse">hub</span>
             <span class="text-[10px] md:text-[11px] font-mono text-slate-400 tracking-widest uppercase">Active Nodes:</span>
             <span #nodeCounter class="text-[10px] md:text-[11px] font-mono text-white font-bold tracking-widest">00</span>
             <span class="text-[10px] md:text-[11px] font-mono text-slate-600 tracking-widest">/ {{ nodes.length }}</span>
        </div>
      </div>

      <!-- Header (Top Left) -->
      <header class="absolute top-6 left-6 md:top-10 md:left-10 z-50 flex flex-col gap-1 pointer-events-none opacity-0" #header>
        <h1 class="text-white font-display text-xl md:text-2xl font-bold tracking-tight uppercase leading-none">Oyeniran Oluwafemi</h1>
        <div class="flex items-center gap-3">
            <div class="h-px w-8 bg-accent/50"></div>
            <span class="text-accent font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold">Software Engineer</span>
        </div>
      </header>
      
      <!-- Terminal Widget (Floating) -->
      <div class="absolute top-28 left-6 md:top-32 md:left-10 z-40 opacity-0" #terminal>
        <div class="bg-[#131b2e]/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-0 w-[300px] md:w-[380px] shadow-[0_0_50px_rgba(0,0,0,0.6)] overflow-hidden group hover:border-accent/40 transition-colors duration-300">
            <!-- Terminal Header -->
            <div class="bg-[#0f1623] px-4 py-3 flex items-center gap-3 border-b border-white/5">
                <div class="flex gap-1.5">
                    <div class="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                </div>
                <span class="ml-2 text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] font-bold">terminal.constellation</span>
            </div>
            
            <!-- Terminal Body -->
            <div class="p-5 font-mono text-xs md:text-sm">
                <div class="flex items-center gap-2 mb-2">
                    <span class="text-emerald-400 font-bold">➜</span>
                    <span class="text-accent">projects</span>
                    <span class="text-slate-500">git:(<span class="text-pink-400">main</span>)</span>
                </div>
                <div class="h-px w-full bg-white/5 mb-4"></div>
                <div class="flex items-center gap-2">
                    <span class="text-accent text-lg font-bold leading-none">&gt;</span>
                    <input class="bg-transparent border-none text-slate-300 placeholder-slate-600 focus:ring-0 w-full font-mono text-xs md:text-sm p-0 focus:outline-none" 
                           placeholder="Query tech stack..." type="text" readonly/>
                    <div class="w-2 h-4 bg-accent animate-pulse shadow-[0_0_8px_#38BDF8]"></div>
                </div>
            </div>
            
            <!-- Connector Point for Line -->
            <div class="absolute top-1/2 -right-1 w-2 h-2 bg-accent rounded-full shadow-[0_0_10px_#38BDF8] translate-x-1/2"></div>
        </div>
      </div>

      <!-- Main Graph Area -->
      <div class="absolute inset-0 z-10 w-full h-full" #graphContainer>
        
        <!-- Connecting Lines SVG Layer -->
        <svg class="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
            <defs>
                <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            
            <!-- Dynamic Lines between nodes -->
            @for (conn of connections; track $index) {
                <line 
                    [attr.x1]="getPos(conn.from).x + '%'" 
                    [attr.y1]="getPos(conn.from).y + '%'"
                    [attr.x2]="getPos(conn.to).x + '%'" 
                    [attr.y2]="getPos(conn.to).y + '%'"
                    class="stroke-accent/20 stroke-[1px] md:stroke-[1.5px] transition-all duration-1000 ease-in-out"
                    stroke-linecap="round"
                />
            }
            
            <!-- Line from Terminal to First Node (Fiscal) -->
             <path 
                [attr.d]="terminalLinePath()"
                class="stroke-accent/40 stroke-[1px] fill-none md:stroke-[1.5px]"
                stroke-dasharray="4 4"
             />
        </svg>

        <!-- Nodes Layer -->
        <div class="absolute inset-0 w-full h-full z-10 pointer-events-none">
            @for (node of nodes; track node.id; let i = $index) {
                <div class="absolute w-0 h-0 flex items-center justify-center pointer-events-auto node-wrapper"
                     [style.left.%]="getPos(i).x"
                     [style.top.%]="getPos(i).y">
                    
                    <!-- The Node -->
                    <a [routerLink]="['/projects', node.id]" class="group relative flex items-center justify-center cursor-pointer -translate-x-1/2 -translate-y-1/2">
                        
                        <!-- Rotating Text Ring -->
                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                             <svg class="w-full h-full animate-spin-super-slow" viewBox="0 0 200 200">
                                <path id="textPath-{{i}}" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" fill="none" />
                                <text class="fill-slate-300 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
                                    <textPath [attr.href]="'#textPath-' + i" startOffset="0%">
                                        {{ node.label }} • {{ node.label }} •
                                    </textPath>
                                </text>
                             </svg>
                        </div>

                        <!-- Core Icon Circle (Smaller now) -->
                        <div class="w-14 h-14 md:w-20 md:h-20 rounded-full bg-[#0F172A]/80 backdrop-blur-md border border-slate-700/50 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-accent group-hover:shadow-[0_0_50px_rgba(56,189,248,0.4)] group-hover:bg-[#0F172A] transition-all duration-300 z-20">
                            <span class="material-symbols-outlined text-2xl md:text-3xl text-slate-400 group-hover:text-white transition-all duration-300 group-hover:scale-110">{{ node.icon }}</span>
                        </div>
                        
                        <!-- Hover Glow Effect -->
                        <div class="absolute inset-0 bg-accent/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 scale-50 group-hover:scale-110"></div>
                    </a>

                </div>
            }
        </div>
      </div>

      <!-- Dock Nav (Bottom Center) -->
      <nav class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 opacity-0" #nav>
         <div class="bg-[#1e293b]/50 backdrop-blur-2xl border border-white/10 rounded-full px-8 py-4 shadow-2xl flex items-center gap-12">
            <a routerLink="/" class="group flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-all">
                <span class="material-symbols-outlined text-xl group-hover:text-accent transition-colors">home_app_logo</span>
                <span class="text-[9px] font-mono uppercase tracking-widest font-bold">Void</span>
            </a>
            <a href="javascript:void(0)" class="group flex flex-col items-center gap-1 text-white">
                <span class="material-symbols-outlined text-xl text-accent drop-shadow-[0_0_8px_#38BDF8]">hub</span>
                <span class="text-[9px] font-mono uppercase tracking-widest font-bold">Constellation</span>
            </a>
            <a routerLink="/writing" class="group flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-all">
                <span class="material-symbols-outlined text-xl group-hover:text-accent transition-colors">article</span>
                <span class="text-[9px] font-mono uppercase tracking-widest font-bold">Ledger</span>
            </a>
            <a routerLink="/contact" class="group flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-all">
                <span class="material-symbols-outlined text-xl group-hover:text-accent transition-colors">terminal</span>
                <span class="text-[9px] font-mono uppercase tracking-widest font-bold">Interface</span>
            </a>
         </div>
      </nav>
      
      <!-- Bottom Left Version/Date Tag -->
      <div class="fixed bottom-8 left-8 z-40 opacity-30 hidden md:block border border-white/20 p-2 w-16 h-16 flex items-center justify-center transform rotate-12 hover:rotate-0 hover:opacity-80 transition-all duration-500 cursor-default">
         <span class="font-code text-[10px] text-accent">0.0.2024</span>
      </div>

    </div>
  `,
  styles: [`
    .bg-grid-pattern {
        background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        background-size: 50px 50px;
    }
    .animate-spin-super-slow {
        animation: spin 60s linear infinite;
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    /* Smooth transitions for responsive layout */
    .node-wrapper {
        transition: left 1s cubic-bezier(0.4, 0, 0.2, 1), top 1s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements AfterViewInit {
  @ViewChild('header') header!: ElementRef;
  @ViewChild('nav') nav!: ElementRef;
  @ViewChild('sysStatus') sysStatus!: ElementRef;
  @ViewChild('terminal') terminal!: ElementRef;
  @ViewChild('starsContainer') starsContainer!: ElementRef;
  @ViewChild('nodeCounter') nodeCounter!: ElementRef;

  isMobile = signal<boolean>(false);

  // Expanded to 10 nodes with smaller spacing strategy
  nodes: ProjectNode[] = [
    { id: 'fiscal-monitor', label: 'FINANCIAL LEDGER INTEGRITY', role: 'FinTech', icon: 'account_balance', x: 20, y: 30, mobileX: 50, mobileY: 10 },
    { id: 'nebula-core', label: 'EDUCATIONAL METRICS PHP', role: 'Backend', icon: 'school', x: 45, y: 15, mobileX: 50, mobileY: 20 },
    { id: 'chronos', label: 'BITRATE STREAMING REACT', role: 'DevOps', icon: 'play_circle', x: 65, y: 35, mobileX: 50, mobileY: 30 },
    { id: 'hyra', label: 'CULTURAL NARRATIVE MOBILE', role: 'Mobile', icon: 'phonelink_ring', x: 15, y: 60, mobileX: 50, mobileY: 40 },
    { id: 'weather-stream', label: 'WEATHER API STREAM', role: 'Infrastr', icon: 'cloud', x: 85, y: 20, mobileX: 50, mobileY: 50 },
    { id: 'void-analytics', label: 'NEXT.JS RETAIL GLOBAL', role: 'Data', icon: 'shopping_cart', x: 75, y: 65, mobileX: 50, mobileY: 60 },
    
    // New Nodes
    { id: 'neural-bridge', label: 'NEURAL NET INTERFACE', role: 'AI', icon: 'psychology', x: 35, y: 75, mobileX: 50, mobileY: 70 },
    { id: 'quantum-sentry', label: 'QUANTUM CRYPTO GUARD', role: 'Security', icon: 'security', x: 55, y: 55, mobileX: 50, mobileY: 80 },
    { id: 'bio-sync', label: 'BIO-HEALTH ANALYTICS', role: 'Health', icon: 'monitor_heart', x: 85, y: 80, mobileX: 50, mobileY: 90 },
    { id: 'iot-mesh', label: 'SMART CITY GRID IOT', role: 'IoT', icon: 'hub', x: 50, y: 90, mobileX: 50, mobileY: 100 },
  ];

  connections: Connection[] = [
    { from: 0, to: 1 },
    { from: 0, to: 3 },
    { from: 1, to: 2 },
    { from: 1, to: 7 }, // Nebula -> Quantum
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 6 }, // Hyra -> Neural
    { from: 5, to: 8 }, // Void -> Bio
    { from: 6, to: 9 }, // Neural -> IoT
    { from: 7, to: 6 }, // Quantum -> Neural
    { from: 7, to: 5 }, // Quantum -> Void
  ];

  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  constructor() {
    this.checkMobile();
  }

  private checkMobile() {
    // Check if window is available (SSR safety)
    if (typeof window !== 'undefined') {
        this.isMobile.set(window.innerWidth < 768);
    }
  }

  getPos(index: number) {
    const node = this.nodes[index];
    if (this.isMobile()) {
        return { x: node.mobileX, y: node.mobileY };
    }
    return { x: node.x, y: node.y };
  }
  
  // Calculate path from Terminal to first node (Index 0 - Fiscal)
  terminalLinePath() {
     if (this.isMobile()) return ''; // Hide on mobile or simplified
     
     // Terminal output point (approximate based on styling)
     // Terminal is at top: 32 (8rem) + height approx 200px. 
     // Let's approximate the "connection point" of the terminal to be around:
     // x: 10% (left) + width (approx) -> say 25%
     // y: 30%
     
     // Hardcoded start point matching the visual design relative to the terminal's fixed position
     const startX = 25; 
     const startY = 22; 
     
     const endNode = this.getPos(0); // Fiscal Node
     
     return `M ${startX}% ${startY}% L ${endNode.x}% ${endNode.y}%`;
  }

  ngAfterViewInit() {
    this.createStars();
    this.animateEntrance();
    this.animateCounter();
  }

  createStars() {
    const container = this.starsContainer.nativeElement;
    const count = 100; // Less dense, more "constellation" feel
    
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2 + 1;
        const opacity = Math.random() * 0.5 + 0.1;
        
        star.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
            background: #fff;
            border-radius: 50%;
            opacity: ${opacity};
            animation: twinkle ${Math.random() * 3 + 2}s infinite ease-in-out;
        `;
        container.appendChild(star);
    }
  }

  animateEntrance() {
    const tl = gsap.timeline();

    tl.to(this.header.nativeElement, { opacity: 1, duration: 1, ease: 'power2.out' })
      .to(this.sysStatus.nativeElement, { opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.8')
      .to(this.nav.nativeElement, { opacity: 1, y: 0, duration: 1, ease: 'back.out(1.7)' }, '-=0.8')
      .to(this.terminal.nativeElement, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.6');

    // Animate Nodes popping in
    gsap.from('.node-wrapper', {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        delay: 0.5
    });

    // Draw lines
    gsap.from('line', {
        strokeDashoffset: 1000,
        strokeDasharray: 1000,
        duration: 2,
        ease: 'power2.out',
        delay: 1
    });
  }

  animateCounter() {
    const obj = { val: 0 };
    gsap.to(obj, {
        val: this.nodes.length,
        duration: 2,
        ease: 'power2.out',
        snap: { val: 1 },
        onUpdate: () => {
            if (this.nodeCounter) {
                this.nodeCounter.nativeElement.innerText = obj.val.toString().padStart(2, '0');
            }
        },
        delay: 1.5
    });
  }
}
