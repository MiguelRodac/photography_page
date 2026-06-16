import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-lightbox',
  imports: [],
  template: `
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
         (click)="close.emit()">
      <button class="absolute top-6 right-6 z-10 p-2 text-white/60 hover:text-white transition-colors"
              (click)="close.emit()" aria-label="Cerrar">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      @if (hasPrev) {
        <button class="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/60 hover:text-white transition-colors"
                (click)="prev($event)" aria-label="Anterior">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
      }

      <div class="relative max-w-[90vw] max-h-[90vh]" (click)="$event.stopPropagation()">
        <img [src]="currentItem.img" [alt]="currentItem.title"
             class="max-w-full max-h-[85vh] object-contain rounded-lg" />
        <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
          <h3 class="text-white text-xl font-display font-semibold">{{ currentItem.title }}</h3>
          @if (currentItem.description) {
            <p class="text-white/70 text-sm mt-1">{{ currentItem.description }}</p>
          }
          <p class="text-white/50 text-xs mt-2">{{ index + 1 }} / {{ total }}</p>
        </div>
      </div>

      @if (hasNext) {
        <button class="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/60 hover:text-white transition-colors"
                (click)="next($event)" aria-label="Siguiente">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      }
    </div>
  `,
  standalone: true,
})
export class LightboxComponent {
  @Input() items: { img: string; title: string; description?: string; category: string }[] = [];
  @Input() index = 0;
  @Output() close = new EventEmitter<void>();

  get currentItem() { return this.items[this.index]; }
  get total() { return this.items.length; }
  get hasPrev() { return this.index > 0; }
  get hasNext() { return this.index < this.items.length - 1; }

  prev(event: Event) { event.stopPropagation(); this.index--; }
  next(event: Event) { event.stopPropagation(); this.index++; }

  @HostListener('document:keydown.escape') onEscape() { this.close.emit(); }
  @HostListener('document:keydown.arrowleft') onArrowLeft() { if (this.hasPrev) this.prev(new Event('keydown')); }
  @HostListener('document:keydown.arrowright') onArrowRight() { if (this.hasNext) this.next(new Event('keydown')); }
}
