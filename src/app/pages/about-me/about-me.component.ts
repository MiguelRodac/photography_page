import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicContentCacheService } from '../../services/public-content-cache.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-about-me',
  imports: [RouterLink],
  templateUrl: './about-me.component.html',
  standalone: true,
})
export class AboutMeComponent implements OnInit {
  private readonly contentCache = inject(PublicContentCacheService);

  readonly aboutTitle = signal('');
  readonly aboutSubtitle = signal('');
  readonly aboutDescription = signal('');
  readonly aboutExtra = signal('');
  readonly philosophyQuote = signal('');
  readonly philosophyText = signal('');
  readonly profileImage = signal('');

  stats = [
    { value: '500+', label: 'Sesiones' },
    { value: '150+', label: 'Clientes' },
    { value: '10', label: 'Años exp.' },
  ];

  services = [
    { id: 'events', title: 'Bodas y eventos', description: 'Cobertura completa de tu día especial con un enfoque documental que captura cada emoción genuina.' },
    { id: 'portrait', title: 'Retratos', description: 'Sesiones personalizadas que reflejan tu personalidad, desde retratos profesionales hasta familiares.' },
    { id: 'commercial', title: 'Comercial', description: 'Fotografía de producto, arquitectura y contenido visual para impulsar tu marca o negocio.' },
    { id: 'editing', title: 'Edición profesional', description: 'Procesamiento digital avanzado con atención al color, iluminación y detalle en cada imagen.' },
  ];

  ngOnInit(): void {
    this.contentCache.getSection<any>('about').pipe(take(1)).subscribe((data) => {
      if (data) {
        this.aboutTitle.set(data.title || '');
        this.aboutSubtitle.set(data.subtitle || '');
        this.aboutDescription.set(data.description || '');
        this.aboutExtra.set(data.extra || '');
        this.philosophyQuote.set(data.quote || '');
        this.philosophyText.set(data.philosophy || '');
        this.profileImage.set(data.image || '');
        if (data.stats) this.stats = data.stats;
        if (data.services) this.services = data.services;
      }
    });
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
