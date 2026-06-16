import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { GlobalResourceService } from '../../services/global-resource.service';
import { LightboxComponent } from '../../shared/lightbox/lightbox.component';

@Component({
  selector: 'app-portfolio',
  imports: [NgClass, LightboxComponent],
  template: `
    <main class="page-transition">
      <section class="py-24 px-6">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h1 class="text-4xl md:text-5xl font-display font-semibold mb-4">Portafolio</h1>
            <p class="text-surface-500 dark:text-surface-400 text-lg max-w-xl mx-auto">
              Una selección de mi mejor trabajo en diferentes categorías.
            </p>
          </div>

          <!-- Filter Buttons -->
          <div class="flex flex-wrap justify-center gap-3 mb-12">
            @for (cat of categories; track cat.key) {
              <button (click)="setFilter(cat.key)"
                      class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                      [ngClass]="{
                        'bg-primary-500 text-white shadow-lg shadow-primary-500/25': activeFilter === cat.key,
                        'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700': activeFilter !== cat.key
                      }">
                {{ cat.label }}
              </button>
            }
          </div>

          <!-- Grid -->
          @if (filteredItems.length === 0) {
            <div class="text-center py-16 text-surface-400">
              <p class="text-lg">No hay imágenes en esta categoría aún.</p>
            </div>
          } @else {
            <div class="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              @for (item of filteredItems; track item.id; let i = $index) {
                <div class="break-inside-avoid group cursor-pointer"
                     (click)="openLightbox(i)">
                  <div class="relative overflow-hidden rounded-2xl">
                    <img [src]="item.img" [alt]="item.title"
                         class="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div class="absolute bottom-0 left-0 right-0 p-5">
                        <span class="text-xs font-medium text-primary-400 uppercase tracking-wider">{{ getCategoryLabel(item.category) }}</span>
                        <h3 class="text-white text-lg font-display font-semibold mt-1">{{ item.title }}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </section>

      @if (lightboxOpen) {
        <app-lightbox
          [items]="filteredItems"
          [index]="lightboxIndex"
          (close)="lightboxOpen = false" />
      }
    </main>
  `,
})
export class PortfolioComponent {
  private readonly resource = inject(GlobalResourceService);
  portfolio = this.resource.getPortfolioItems();

  categories = [
    { key: 'all', label: 'Todos' },
    { key: 'wedding', label: 'Bodas' },
    { key: 'portrait', label: 'Retratos' },
    { key: 'landscape', label: 'Paisajes' },
    { key: 'event', label: 'Eventos' },
    { key: 'commercial', label: 'Comercial' },
  ];

  activeFilter = 'all';
  lightboxOpen = false;
  lightboxIndex = 0;

  get filteredItems() {
    return this.activeFilter === 'all'
      ? this.portfolio
      : this.portfolio.filter(item => item.category === this.activeFilter);
  }

  setFilter(key: string) {
    this.activeFilter = key;
  }

  openLightbox(index: number) {
    this.lightboxIndex = index;
    this.lightboxOpen = true;
  }

  getCategoryLabel(key: string): string {
    return this.categories.find(c => c.key === key)?.label || key;
  }
}
