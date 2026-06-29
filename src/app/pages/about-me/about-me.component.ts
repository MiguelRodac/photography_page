import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicContentCacheService } from '../../services/public-content-cache.service';
import { PageSectionsConfig, PageSectionItem } from '../../core/interfaces/firestore-models';
import { take } from 'rxjs';

@Component({
  selector: 'app-about-me',
  imports: [RouterLink],
  templateUrl: './about-me.component.html',
  standalone: true,
})
export class AboutMeComponent implements OnInit {
  private readonly contentCache = inject(PublicContentCacheService);

  readonly heroLabel = signal('Sobre mí');
  readonly aboutTitle = signal('');
  readonly aboutSubtitle = signal('');
  readonly aboutDescription = signal('');
  readonly aboutExtra = signal('');
  readonly profileImageAlt = signal('Fotógrafo en acción');
  readonly overlayImage = signal('');
  readonly overlayImageAlt = signal('Cámara profesional');
  readonly philosophyLabel = signal('Mi filosofía');
  readonly philosophyQuote = signal('');
  readonly philosophyText = signal('');
  readonly profileImage = signal('');
  readonly servicesLabel = signal('Servicios');
  readonly servicesTitle = signal('Lo que ofrezco');
  readonly aboutSections = signal<PageSectionItem[]>([]);
  readonly aboutCtaTitle = signal('');
  readonly aboutCtaDesc = signal('');
  readonly aboutCtaButtonText = signal('');
  readonly aboutCtaRoute = signal('');
  readonly aboutServices = signal<{ id: string; title: string; description: string }[]>([]);
  readonly stats = signal<{ value: string; label: string }[]>([]);

  ngOnInit(): void {
    this.contentCache.getSection<any>('about').pipe(take(1)).subscribe((data) => {
      if (data) {
        if (data.heroLabel) this.heroLabel.set(data.heroLabel);
        this.aboutTitle.set(data.title || '');
        this.aboutSubtitle.set(data.subtitle || '');
        this.aboutDescription.set(data.description || '');
        this.aboutExtra.set(data.extra || '');
        if (data.profileImageAlt) this.profileImageAlt.set(data.profileImageAlt);
        if (data.overlayImage) this.overlayImage.set(data.overlayImage);
        if (data.overlayImageAlt) this.overlayImageAlt.set(data.overlayImageAlt);
        if (data.philosophyLabel) this.philosophyLabel.set(data.philosophyLabel);
        this.philosophyQuote.set(data.quote || '');
        this.philosophyText.set(data.philosophy || '');
        this.profileImage.set(data.image || '');
        if (data.servicesLabel) this.servicesLabel.set(data.servicesLabel);
        if (data.servicesTitle) this.servicesTitle.set(data.servicesTitle);
        if (data.stats) this.stats.set(data.stats);
        if (data.services) this.aboutServices.set(data.services);
      }
    });

    this.contentCache.getSection<any>('about-sections').pipe(take(1)).subscribe((data) => {
      if (data?.sections) {
        this.aboutSections.set(data.sections);
      }
    });

    this.contentCache.getSection<any>('services').pipe(take(1)).subscribe((data) => {
      if (data?.services) {
        this.aboutServices.set(data.services);
      }
    });

    this.contentCache.getSection<any>('cta').pipe(take(1)).subscribe((data) => {
      if (data) {
        if (data['title']) this.aboutCtaTitle.set(data['title']);
        if (data['description']) this.aboutCtaDesc.set(data['description']);
        if (data['buttonText']) this.aboutCtaButtonText.set(data['buttonText']);
        if (data['ctaRoute']) this.aboutCtaRoute.set(data['ctaRoute']);
      }
    });
  }

  isSectionVisible(sectionId: string): boolean {
    const sections = this.aboutSections();
    if (sections.length === 0) return true;
    const section = sections.find((s) => s.id === sectionId);
    return section ? section.visible : true;
  }

  getServiceIcon(id: string): string {
    const icons: Record<string, string> = {
      events: '📸',
      portrait: '👤',
      commercial: '🏢',
      editing: '🎨',
    };
    return icons[id] || '📷';
  }
}
