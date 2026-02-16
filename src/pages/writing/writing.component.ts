import { Component, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

declare var gsap: any;

@Component({
  selector: 'app-writing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col overflow-hidden bg-bg-void text-slate-text font-body">
      <!-- BG FX -->
      <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div class="absolute inset-0 constellation-bg opacity-40"></div>
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px]"></div>
      </div>

      <div class="flex flex-1 h-screen w-full relative z-10">
        <!-- Sidebar -->
        <aside class="hidden lg:flex w-1/4 xl:w-1/5 flex-col justify-between border-r border-white/10 p-12 relative bg-bg-void/40 backdrop-blur-md z-20 sidebar">
            <div class="flex flex-col gap-12">
                <a class="flex flex-col gap-1 group" routerLink="/">
                    <span class="font-display text-xs tracking-[0.3em] text-accent mb-2">ENGINEER</span>
                    <span class="font-display font-bold text-xl text-primary leading-tight uppercase tracking-tight">Oyeniran<br/>Oluwafemi</span>
                </a>
                <div class="mt-12">
                    <h1 class="text-7xl font-display font-bold tracking-tighter text-primary/10 select-none mb-4">LOGS</h1>
                    <div class="h-px w-full bg-gradient-to-r from-accent/50 to-transparent mb-6"></div>
                    <p class="text-slate-muted text-sm font-code leading-relaxed">
                        A digital ledger of architectural proofs, technical essays, and algorithmic explorations.
                    </p>
                </div>
            </div>
            <nav class="flex flex-col gap-6 font-code text-[11px] tracking-widest text-slate-muted uppercase">
                <a routerLink="/" class="hover:text-accent transition-all duration-300 flex items-center gap-3 group">
                    <span class="w-1.5 h-1.5 border border-slate-muted group-hover:border-accent group-hover:bg-accent transition-all"></span> 
                    Home
                </a>
                <a href="javascript:void(0)" class="text-primary flex items-center gap-3 group">
                    <span class="w-1.5 h-1.5 bg-accent shadow-[0_0_10px_#38BDF8]"></span> 
                    Writing
                </a>
                <a routerLink="/projects" class="hover:text-accent transition-all duration-300 flex items-center gap-3 group">
                    <span class="w-1.5 h-1.5 border border-slate-muted group-hover:border-accent group-hover:bg-accent transition-all"></span> 
                    Projects
                </a>
                <a routerLink="/contact" class="hover:text-accent transition-all duration-300 flex items-center gap-3 group">
                    <span class="w-1.5 h-1.5 border border-slate-muted group-hover:border-accent group-hover:bg-accent transition-all"></span> 
                    Contact
                </a>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 flex flex-col h-full overflow-hidden relative">
            <header class="lg:hidden flex items-center justify-between px-8 py-6 border-b border-white/5 bg-bg-void/80 backdrop-blur-xl sticky top-0 z-20">
                <div class="flex flex-col">
                    <span class="font-display font-bold text-primary tracking-tight">OYENIRAN OLUWAFEMI</span>
                </div>
                <a routerLink="/" class="text-accent material-symbols-outlined">home</a>
            </header>

            <div class="flex-1 overflow-y-auto px-8 lg:px-24 py-16 lg:py-32 scroll-smooth">
                <div class="max-w-5xl w-full mx-auto">
                    <div class="mb-20 flex items-center gap-4 text-slate-muted font-code text-xs uppercase tracking-[0.2em] fade-in">
                        <span>Directory</span>
                        <span class="text-accent/30">/</span>
                        <span class="text-accent">The Ledger</span>
                    </div>

                    <div class="flex flex-col">
                        <!-- Articles -->
                        @for (article of articles; track article.title) {
                            <article class="article-row group border-b border-slate-800 hover:bg-[#1e293b] transition-all duration-700 cursor-pointer fade-in-up opacity-0 translate-y-8">
                                <div class="flex flex-col md:flex-row md:items-center gap-6 py-10 px-4">
                                    <time class="w-32 flex-shrink-0 font-code text-xs text-slate-muted tracking-tighter">{{ article.date }}</time>
                                    <div class="flex-1">
                                        <h2 class="article-title text-3xl md:text-4xl text-primary font-display transition-all duration-500 ease-out">
                                            {{ article.title }}
                                        </h2>
                                    </div>
                                    <div class="flex items-center gap-12 md:justify-end min-w-[180px]">
                                        <span class="font-code text-[10px] text-slate-muted tracking-widest uppercase">{{ article.readTime }}</span>
                                        <div class="article-arrow opacity-0 -translate-x-4 transition-all duration-500 text-accent">
                                            <span class="material-symbols-outlined text-3xl">arrow_right_alt</span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        }
                    </div>

                    <div class="mt-32 flex flex-col items-center gap-8 fade-in opacity-0">
                        <div class="h-px w-24 bg-accent/20"></div>
                        <span class="font-code text-[10px] text-slate-muted tracking-[0.4em] uppercase">End of Transmission</span>
                    </div>
                </div>
            </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .constellation-bg {
        background-image: radial-gradient(circle at 2px 2px, rgba(56, 189, 248, 0.15) 1px, transparent 0);
        background-size: 40px 40px;
        mask-image: radial-gradient(circle at center, black, transparent 80%);
    }
    .article-row:hover .article-title {
        color: #38BDF8; /* accent */
        transform: translateX(20px);
    }
    .article-row:hover .article-arrow {
        opacity: 1;
        transform: translateX(0);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WritingComponent implements AfterViewInit {
  articles = [
    { date: '2023.10.24', title: 'The Geometry of State Management', readTime: '4 min read' },
    { date: '2023.09.12', title: 'Silence in the Wire: A Study on Latency', readTime: '6 min read' },
    { date: '2023.08.01', title: 'Refactoring the Void', readTime: '3 min read' },
    { date: '2023.07.15', title: 'Asymmetrical Layouts in React', readTime: '5 min read' }
  ];

  ngAfterViewInit() {
    gsap.from('.sidebar', {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.to('.fade-in', {
        opacity: 1,
        duration: 1,
        delay: 0.2
    });

    gsap.to('.fade-in-up', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        delay: 0.3
    });
  }
}