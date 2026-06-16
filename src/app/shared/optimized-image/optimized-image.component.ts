import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-optimized-image',
  imports: [NgOptimizedImage],
  template: `
    <div class="relative overflow-hidden" [class.aspect-square]="aspectRatio === 'square'" [class.aspect-video]="aspectRatio === 'video'" [class.aspect-[3/4]]="aspectRatio === 'portrait'" [class.aspect-[4/3]]="aspectRatio === 'landscape'">
      <img
        [ngSrc]="src"
        [alt]="alt"
        [width]="width"
        [height]="height"
        [priority]="priority"
        [class]="imgClass"
        class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
    </div>
  `,
  standalone: true,
})
export class OptimizedImageComponent {
  @Input() src = '';
  @Input() alt = '';
  @Input() width = 800;
  @Input() height = 600;
  @Input() priority = false;
  @Input() aspectRatio: 'square' | 'video' | 'portrait' | 'landscape' = 'landscape';
  @Input() imgClass = '';
}
