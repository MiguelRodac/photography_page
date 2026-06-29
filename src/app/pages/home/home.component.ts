import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicContentCacheService } from '../../services/public-content-cache.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { PageSectionsConfig, PageSectionItem } from '../../core/interfaces/firestore-models';
import { take } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RevealDirective],
  templateUrl: './home.component.html',
  standalone: true,
})
export class HomeComponent implements OnInit {
  private readonly contentCache = inject(PublicContentCacheService);

  // Dynamic content from Firebase
  readonly heroData = signal<any>(null);
  readonly servicesData = signal<any>(null);
  readonly homeSections = signal<PageSectionItem[]>([]);
  readonly testimonials = signal<any[]>([]);
  readonly portfolioItems = signal<any[]>([]);

  // Section text from Firebase
  readonly servicesSectionTitle = signal('');
  readonly servicesSectionDesc = signal('');
  readonly portfolioPreviewTitle = signal('');
  readonly portfolioPreviewDesc = signal('');
  readonly portfolioPreviewCta = signal('');
  readonly testimonialsTitle = signal('');
  readonly testimonialsDesc = signal('');
  readonly ctaTitle = signal('');
  readonly ctaDesc = signal('');
  readonly ctaButtonText = signal('');

  ngOnInit(): void {
    const start = performance.now();

    this.contentCache.getSection<any>('hero').pipe(take(1)).subscribe((data) => {
      if (data) this.heroData.set(data);
      console.debug(`[Home] Hero loaded in ${(performance.now() - start).toFixed(0)}ms`);
    });

    this.contentCache.getSection<any>('services').pipe(take(1)).subscribe((data) => {
      if (data) {
        this.servicesData.set(data);
        if (data['sectionTitle']) this.servicesSectionTitle.set(data['sectionTitle']);
        if (data['sectionDescription']) this.servicesSectionDesc.set(data['sectionDescription']);
      }
    });

    this.contentCache.getSection<any>('testimonials').pipe(take(1)).subscribe((data) => {
      if (data) {
        if (data['sectionTitle']) this.testimonialsTitle.set(data['sectionTitle']);
        if (data['sectionDescription']) this.testimonialsDesc.set(data['sectionDescription']);
        if (data['testimonials']) this.testimonials.set(data['testimonials']);
      }
    });

    this.contentCache.getSection<any>('portfolio-preview').pipe(take(1)).subscribe((data) => {
      if (data) {
        if (data['sectionTitle']) this.portfolioPreviewTitle.set(data['sectionTitle']);
        if (data['sectionDescription']) this.portfolioPreviewDesc.set(data['sectionDescription']);
        if (data['ctaText']) this.portfolioPreviewCta.set(data['ctaText']);
        if (data['items']) this.portfolioItems.set(data['items']);
      }
    });

    this.contentCache.getSection<any>('cta').pipe(take(1)).subscribe((data) => {
      if (data) {
        if (data['title']) this.ctaTitle.set(data['title']);
        if (data['description']) this.ctaDesc.set(data['description']);
        if (data['buttonText']) this.ctaButtonText.set(data['buttonText']);
      }
    });

    this.contentCache.getSection<PageSectionsConfig>('home-sections').pipe(take(1)).subscribe((data) => {
      if (data?.sections) {
        this.homeSections.set(data.sections);
      }
    });
  }

  isSectionVisible(sectionId: string): boolean {
    const sections = this.homeSections();
    if (sections.length === 0) return true; // Default: show all if no config
    const section = sections.find((s) => s.id === sectionId);
    return section ? section.visible : true;
  }

  getHeroLayout(): string {
    return this.heroData()?.layout || 'parallax';
  }

  getServicesLayout(): string {
    return this.servicesData()?.layout || 'grid-4';
  }
}
