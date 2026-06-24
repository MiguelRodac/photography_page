import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlobalResourceService } from '../../services/global-resource.service';
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
  private readonly resource = inject(GlobalResourceService);
  private readonly contentCache = inject(PublicContentCacheService);

  readonly services = this.resource.getServices();
  readonly portfolio = this.resource.getPortfolioItems().slice(0, 3);
  readonly content = this.resource.getSiteContent();

  // Dynamic content from Firebase
  readonly heroData = signal<any>(null);
  readonly servicesData = signal<any>(null);
  readonly homeSections = signal<PageSectionItem[]>([]);

  readonly testimonials = [
    { name: 'María García', role: 'Boda • Mayo 2024', text: 'Increíble trabajo. Capturó cada momento especial de nuestra boda con una sensibilidad única. Las fotos son espectaculares.' },
    { name: 'Carlos Mendoza', role: 'Retrato Corporativo', text: 'Profesionalismo absoluto. Las fotos para nuestro equipo directivo quedaron impecables. Superó todas nuestras expectativas.' },
    { name: 'Ana López', role: 'Sesión Familiar', text: 'Hizo que toda la familia se sintiera cómoda. Las fotos naturales son justo lo que queríamos. ¡Repetiremos sin duda!' },
  ];

  ngOnInit(): void {
    const start = performance.now();

    this.contentCache.getSection<any>('hero').pipe(take(1)).subscribe((data) => {
      if (data) this.heroData.set(data);
      console.debug(`[Home] Hero loaded in ${(performance.now() - start).toFixed(0)}ms`);
    });

    this.contentCache.getSection<any>('services').pipe(take(1)).subscribe((data) => {
      if (data) this.servicesData.set(data);
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
