import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { PublicContentCacheService } from '../../services/public-content-cache.service';
import { LightboxComponent } from '../../shared/lightbox/lightbox.component';
import { PORTFOLIO_SERVICE } from '../../core/tokens/portfolio-service.token';
import { CATEGORIES_SERVICE } from '../../core/tokens/categories-service.token';
import { PortfolioDoc, CategoryDoc } from '../../core/interfaces/firestore-models';
import { take } from 'rxjs';

interface PortfolioItem {
  id: string | number;
  title: string;
  category: string;
  img: string;
  description: string;
  link?: string;
  showLink?: boolean;
}

@Component({
  selector: 'app-portfolio',
  imports: [NgClass, LightboxComponent],
  template: `
    <main class="page-transition">
      <section class="py-24 px-6">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h1 class="text-4xl md:text-5xl font-display font-semibold mb-4">{{ pageTitle() }}</h1>
            <p class="text-surface-500 dark:text-surface-400 text-lg max-w-xl mx-auto">
              {{ pageSubtitle() }}
            </p>
          </div>

          <!-- Filter Buttons -->
          <div class="flex flex-wrap justify-center gap-3 mb-12">
            @for (cat of categories(); track cat.key) {
              <button (click)="setFilter(cat.key)"
                      class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                      [ngClass]="{
                        'bg-primary-500 text-white shadow-lg shadow-primary-500/25': activeFilter() === cat.key,
                        'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700': activeFilter() !== cat.key
                      }">
                {{ cat.label }}
              </button>
            }
          </div>

          <!-- Grid -->
          @if (filteredItems().length === 0) {
            <div class="text-center py-16 text-surface-400">
              <p class="text-lg">{{ emptyMessage() }}</p>
            </div>
          } @else {
            <div class="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              @for (item of filteredItems(); track item.id; let i = $index) {
                <div class="break-inside-avoid group cursor-pointer"
                     (click)="openLightbox(i)">
                  <div class="relative overflow-hidden rounded-2xl">
                    <img [src]="item.img" [alt]="item.title"
                         class="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
                    @if (item.link && item.showLink) {
                      <span class="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 bg-primary-500/90 text-white text-xs font-medium rounded-md backdrop-blur-sm">
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        Link
                      </span>
                    }
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div class="absolute bottom-0 left-0 right-0 p-5">
                        <span class="text-xs font-medium text-primary-400 uppercase tracking-wider">{{ getCategoryLabel(item.category) }}</span>
                        <h3 class="text-white text-lg font-display font-semibold mt-1">{{ item.title }}</h3>
                        @if (item.link && item.showLink) {
                          <a [href]="item.link" target="_blank" rel="noopener noreferrer"
                             (click)="$event.stopPropagation()"
                             class="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-primary-500 hover:bg-primary-400 text-white text-xs font-medium rounded-md transition-colors">
                            View Project
                            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                          </a>
                        }
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
          [items]="filteredItems()"
          [index]="lightboxIndex"
          (close)="lightboxOpen = false" />
      }
    </main>
  `,
})
export class PortfolioComponent implements OnInit {
  private readonly portfolioService = inject(PORTFOLIO_SERVICE, { optional: true });
  private readonly contentCache = inject(PublicContentCacheService);
  private readonly categoriesService = inject(CATEGORIES_SERVICE, { optional: true });

  readonly portfolioItems = signal<PortfolioItem[]>([]);
  readonly activeFilter = signal('all');
  lightboxOpen = false;
  lightboxIndex = 0;

  // Dynamic content from Firebase
  readonly pageTitle = signal('');
  readonly pageSubtitle = signal('');
  readonly emptyMessage = signal('');
  readonly categories = signal<{ key: string; label: string }[]>([]);
  readonly allCategoriesLabel = signal('');

  readonly filteredItems = computed(() => {
    const filter = this.activeFilter();
    const items = this.portfolioItems();
    return filter === 'all' ? items : items.filter(item => item.category === filter);
  });

  ngOnInit(): void {
    // Load page content from Firebase
    this.contentCache.getSection<any>('portfolio').pipe(take(1)).subscribe((data) => {
      if (data) {
        if (data['pageTitle']) this.pageTitle.set(data['pageTitle']);
        if (data['pageSubtitle']) this.pageSubtitle.set(data['pageSubtitle']);
        if (data['emptyMessage']) this.emptyMessage.set(data['emptyMessage']);
        if (data['allCategoriesLabel']) this.allCategoriesLabel.set(data['allCategoriesLabel']);
      }
    });

    // Load categories from Firebase
    if (this.categoriesService) {
      this.categoriesService.getAll().pipe(take(1)).subscribe((docs: CategoryDoc[]) => {
        const dynamic = docs
          .sort((a, b) => a.order - b.order)
          .map((d) => ({ key: d.slug, label: d.name }));
        this.categories.set([{ key: 'all', label: this.allCategoriesLabel() || 'All' }, ...dynamic]);
      });
    }

    if (this.portfolioService) {
      this.portfolioService.getAll().pipe(take(1)).subscribe(docs => {
        const mapped: PortfolioItem[] = docs
          .filter((d: PortfolioDoc) => !d.deleted)
          .map((d: PortfolioDoc) => ({
            id: d.id,
            title: d.title,
            category: d.category,
            img: d.img,
            description: d.description,
            link: d.link,
            showLink: d.showLink,
          }));
        if (mapped.length > 0) {
          this.portfolioItems.set(mapped);
        }
      });
    }
  }

  setFilter(key: string) {
    this.activeFilter.set(key);
  }

  openLightbox(index: number) {
    this.lightboxIndex = index;
    this.lightboxOpen = true;
  }

  getCategoryLabel(key: string): string {
    return this.categories().find(c => c.key === key)?.label || key;
  }
}
