import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

declare var gsap: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="h-screen w-screen flex flex-col items-center justify-center relative selection:bg-accent selection:text-bg-void overflow-hidden">
      <canvas #generativeCanvas class="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"></canvas>
      
      <main class="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full h-full justify-center opacity-0" #mainContent>
        <div class="flex flex-col items-center gap-8">
          <div class="mb-2 text-accent opacity-90 scale-0" #icon>
            <span class="material-symbols-outlined text-6xl font-extralight">architecture</span>
          </div>
          
          <h1 class="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight text-primary leading-tight uppercase text-shadow-glow translate-y-10 opacity-0" #title>
            Oyeniran Oluwafemi
          </h1>
          
          <div class="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-accent/30 bg-accent/5 backdrop-blur-md opacity-0 scale-90" #badge>
            <span class="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_#38BDF8] animate-pulse"></span>
            <span class="font-code text-xs md:text-sm tracking-[0.4em] text-accent uppercase font-medium">Software Engineer</span>
          </div>
          
          <p class="mt-4 max-w-2xl text-lg md:text-xl text-slate-muted font-normal leading-relaxed tracking-wide opacity-0 translate-y-4" #desc>
            Mastering the duality of <span class="text-primary/90 font-medium">Frontend Artistry</span> and 
            <span class="text-primary/90 font-medium">Backend Logic</span>. Translating complex mathematical structures into elegant digital experiences.
          </p>
        </div>
      </main>

      <nav class="fixed bottom-12 left-1/2 -translate-x-1/2 z-20 w-auto opacity-0 translate-y-10" #nav>
        <div class="glass-dock px-3 p-2 rounded-full flex items-center gap-1 transition-all duration-700 hover:shadow-accent/20">
          <a class="group relative flex items-center gap-3 px-6 py-3 rounded-full hover:bg-white/5 transition-all duration-500" routerLink="/projects">
            <span class="material-symbols-outlined text-slate-muted group-hover:text-accent transition-colors text-[20px]">hub</span>
            <span class="text-sm font-display tracking-widest text-slate-text group-hover:text-primary transition-colors uppercase">Projects</span>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-accent opacity-0 group-hover:opacity-100 transition-all duration-500 blur-[1px]"></div>
          </a>
          <div class="w-[1px] h-6 bg-white/10 mx-1"></div>
          <a class="group relative flex items-center gap-3 px-6 py-3 rounded-full hover:bg-white/5 transition-all duration-500" routerLink="/writing">
            <span class="material-symbols-outlined text-slate-muted group-hover:text-accent transition-colors text-[20px]">menu_book</span>
            <span class="text-sm font-display tracking-widest text-slate-text group-hover:text-primary transition-colors uppercase">Writing</span>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-accent opacity-0 group-hover:opacity-100 transition-all duration-500 blur-[1px]"></div>
          </a>
          <div class="w-[1px] h-6 bg-white/10 mx-1"></div>
          <a class="group relative flex items-center gap-3 px-6 py-3 rounded-full hover:bg-white/5 transition-all duration-500" routerLink="/contact">
            <span class="material-symbols-outlined text-slate-muted group-hover:text-accent transition-colors text-[20px]">terminal</span>
            <span class="text-sm font-display tracking-widest text-slate-text group-hover:text-primary transition-colors uppercase">Contact</span>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-accent opacity-0 group-hover:opacity-100 transition-all duration-500 blur-[1px]"></div>
          </a>
        </div>
      </nav>

      <div class="fixed inset-0 pointer-events-none z-[5] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.8)_100%)]"></div>
      <div class="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]" style="background-image: linear-gradient(#F8FAFC 1px, transparent 1px), linear-gradient(90deg, #F8FAFC 1px, transparent 1px); background-size: 60px 60px;"></div>
    </div>
  `,
  styles: [`
    .text-shadow-glow {
      text-shadow: 0 0 30px rgba(56, 189, 248, 0.3);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('generativeCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('mainContent') mainContent!: ElementRef;
  @ViewChild('icon') icon!: ElementRef;
  @ViewChild('title') title!: ElementRef;
  @ViewChild('badge') badge!: ElementRef;
  @ViewChild('desc') desc!: ElementRef;
  @ViewChild('nav') nav!: ElementRef;

  private ctx!: CanvasRenderingContext2D;
  private animationFrameId: number = 0;
  private particles: Particle[] = [];
  private width: number = 0;
  private height: number = 0;
  private mouse = { x: -1000, y: -1000 };
  private resizeListener!: () => void;
  private mouseMoveListener!: (e: MouseEvent) => void;

  ngAfterViewInit() {
    this.initCanvas();
    this.animateEntrance();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.resizeListener);
    window.removeEventListener('mousemove', this.mouseMoveListener);
  }

  private animateEntrance() {
    const tl = gsap.timeline();
    
    tl.to(this.mainContent.nativeElement, { opacity: 1, duration: 1 })
      .to(this.icon.nativeElement, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.5')
      .to(this.title.nativeElement, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.6')
      .to(this.badge.nativeElement, { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.8')
      .to(this.desc.nativeElement, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4')
      .to(this.nav.nativeElement, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.6');
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    this.resizeListener = () => {
      this.width = canvas.width = window.innerWidth;
      this.height = canvas.height = window.innerHeight;
      this.createParticles();
    };
    
    this.mouseMoveListener = (e: MouseEvent) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    };

    window.addEventListener('resize', this.resizeListener);
    window.addEventListener('mousemove', this.mouseMoveListener);
    
    this.resizeListener(); // Initial sizing
    this.animate();
  }

  private createParticles() {
    this.particles = [];
    // Increased density: Divider changed from 15000 to 11000
    const particleCount = Math.floor((this.width * this.height) / 11000); 
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.width, this.height));
    }
  }

  private animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Slight rotation of the entire context to simulate galaxy drift
    const time = Date.now() * 0.0001;
    this.ctx.save();

    this.particles.forEach(p => {
      p.update(this.mouse.x, this.mouse.y, this.width, this.height);
      p.draw(this.ctx);
    });

    this.drawConnections();
    
    this.ctx.restore();
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  private drawConnections() {
    const connectionDistance = 160; // Slightly increased distance
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < connectionDistance) {
            // Increased opacity multiplier from 0.15 to 0.5 for much better visibility
            const opacity = (1 - (dist / connectionDistance)) * 0.5;
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`; // Accent color lines
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
        }
      }
    }
  }
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseX: number;
  baseY: number;
  angle: number;
  radius: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.baseX = this.x;
    this.baseY = this.y;
    // Velocity
    this.vx = (Math.random() - 0.5) * 0.2;
    this.vy = (Math.random() - 0.5) * 0.2;
    this.size = Math.random() * 2;
    
    // Orbital properties
    this.angle = Math.random() * Math.PI * 2;
    this.radius = Math.random() * 100 + 20; 
  }

  update(mouseX: number, mouseY: number, width: number, height: number) {
    // Basic movement
    this.x += this.vx;
    this.y += this.vy;

    // Boundary check / bounce
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    // Mouse interaction - repel
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 200;
    
    if (distance < maxDistance) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const force = (maxDistance - distance) / maxDistance;
      const directionX = forceDirectionX * force * 1.5;
      const directionY = forceDirectionY * force * 1.5;

      this.x -= directionX;
      this.y -= directionY;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    // Increased base opacity from 0.2 to 0.4
    ctx.fillStyle = `rgba(248, 250, 252, ${Math.random() * 0.5 + 0.4})`;
    ctx.fill();
  }
}