import { inject, Injectable, signal, RendererFactory2 } from '@angular/core';
import { PublicContentCacheService } from './public-content-cache.service';
import { ThemeSettings } from '../core/interfaces/firestore-models';
import { take } from 'rxjs';

const DEFAULT_THEME: ThemeSettings = {
  primaryColor: '#d4892e',
  primaryHover: '#bd7023',
  displayFont: '"Cormorant Garamond"',
  bodyFont: '"Inter"',
  borderRadius: '12px',
  darkModeDefault: false,
};

@Injectable({ providedIn: 'root' })
export class ThemeLoaderService {
  private readonly contentCache = inject(PublicContentCacheService);
  private readonly rendererFactory = inject(RendererFactory2);
  private readonly renderer = this.rendererFactory.createRenderer(null, null);

  readonly theme = signal<ThemeSettings>(DEFAULT_THEME);

  loadTheme(): void {
    this.contentCache.getSection<ThemeSettings>('theme').pipe(take(1)).subscribe({
      next: (data) => {
        if (data) {
          const merged = { ...DEFAULT_THEME, ...data };
          this.theme.set(merged);
          this.applyTheme(merged);
        } else {
          this.applyTheme(DEFAULT_THEME);
        }
      },
      error: () => {
        this.applyTheme(DEFAULT_THEME);
      },
    });
  }

  applyTheme(t: ThemeSettings): void {
    const root = document.documentElement;
    this.renderer.setStyle(root, '--primary', t.primaryColor);
    this.renderer.setStyle(root, '--primary-hover', t.primaryHover);
    this.renderer.setStyle(root, '--primary-rgb', this.hexToRgb(t.primaryColor));
    this.renderer.setStyle(root, '--font-display', t.displayFont);
    this.renderer.setStyle(root, '--font-body', t.bodyFont);
    this.renderer.setStyle(root, '--radius', t.borderRadius);
  }

  private hexToRgb(hex: string): string {
    const cleaned = hex.replace('#', '');
    const bigint = parseInt(cleaned, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  }
}
