import { inject, Injectable, signal, RendererFactory2, Renderer2 } from '@angular/core';
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
  private readonly renderer: Renderer2 = this.rendererFactory.createRenderer(null, null);
  private styleElement: HTMLStyleElement | null = null;

  readonly theme = signal<ThemeSettings>(DEFAULT_THEME);

  loadTheme(): void {
    this.contentCache.getSection<ThemeSettings>('theme').pipe(take(1)).subscribe({
      next: (data) => {
        const merged = data ? { ...DEFAULT_THEME, ...data } : DEFAULT_THEME;
        this.theme.set(merged);
        this.applyTheme(merged);
      },
      error: () => this.applyTheme(DEFAULT_THEME),
    });
  }

  applyTheme(t: ThemeSettings): void {
    const root = document.documentElement;
    const primary = t.primaryColor;
    const rgb = this.hexToRgb(primary);

    // Set CSS custom properties
    this.renderer.setStyle(root, '--primary', primary);
    this.renderer.setStyle(root, '--primary-hover', t.primaryHover);
    this.renderer.setStyle(root, '--primary-rgb', rgb);
    this.renderer.setStyle(root, '--font-display', t.displayFont);
    this.renderer.setStyle(root, '--font-body', t.bodyFont);
    this.renderer.setStyle(root, '--radius', t.borderRadius);

    // Generate dynamic <style> tag to override ALL primary color uses
    this.injectStyleTag(primary, t.primaryHover, rgb);
  }

  private injectStyleTag(primary: string, hover: string, rgb: string): void {
    // Remove previous style tag if exists
    if (this.styleElement) {
      this.renderer.removeChild(document.head, this.styleElement);
    }

    const css = `
      /* Auto-generated theme overrides */
      .bg-primary-400, .bg-primary-500, .bg-primary-600, .bg-primary-700 {
        background-color: ${primary} !important;
      }
      .hover\\:bg-primary-400:hover, .hover\\:bg-primary-500:hover,
      .hover\\:bg-primary-600:hover, .hover\\:bg-primary-700:hover {
        background-color: ${hover} !important;
      }
      .text-primary-300, .text-primary-400, .text-primary-500, .text-primary-600, .text-primary-700 {
        color: ${primary} !important;
      }
      .hover\\:text-primary-400:hover, .hover\\:text-primary-500:hover {
        color: ${hover} !important;
      }
      .border-primary-400, .border-primary-500, .border-primary-600 {
        border-color: ${primary} !important;
      }
      .hover\\:border-primary-500\\/30:hover, .hover\\:border-primary-500\\/50:hover,
      .hover\\:border-primary-500\\/40:hover {
        border-color: ${hover} !important;
      }
      .focus\\:border-primary-500:focus { border-color: ${primary} !important; }
      .bg-primary-500\\/5, .bg-primary-600\\/5 { background-color: rgba(${rgb}, 0.05) !important; }
      .bg-primary-500\\/10, .bg-primary-600\\/10 { background-color: rgba(${rgb}, 0.1) !important; }
      .bg-primary-500\\/15, .bg-primary-600\\/15 { background-color: rgba(${rgb}, 0.15) !important; }
      .bg-primary-500\\/20, .bg-primary-600\\/20 { background-color: rgba(${rgb}, 0.2) !important; }
      .bg-primary-500\\/30, .bg-primary-600\\/30 { background-color: rgba(${rgb}, 0.3) !important; }
      .ring-primary-500, .focus\\:ring-primary-500:focus { --tw-ring-color: ${primary} !important; }
      .ring-primary-500\\/50, .focus\\:ring-primary-500\\/50:focus { --tw-ring-color: rgba(${rgb}, 0.5) !important; }
      .shadow-primary-500\\/10 { --tw-shadow-color: rgba(${rgb}, 0.1) !important; }
      .shadow-primary-500\\/20 { --tw-shadow-color: rgba(${rgb}, 0.2) !important; }
      .shadow-primary-500\\/25 { --tw-shadow-color: rgba(${rgb}, 0.25) !important; }
      .shadow-primary-500\\/30 { --tw-shadow-color: rgba(${rgb}, 0.3) !important; }
      .shadow-primary-600\\/20 { --tw-shadow-color: rgba(${rgb}, 0.2) !important; }
      .from-primary-500, .from-primary-600 { --tw-gradient-from: ${primary} !important; }
      .to-primary-400, .to-primary-500, .to-primary-600 { --tw-gradient-to: ${primary} !important; }
      .accent-primary-500 { accent-color: ${primary} !important; }
      .hover\\:bg-primary-500\\/20:hover { background-color: rgba(${rgb}, 0.2) !important; }
      .hover\\:bg-primary-500\\/10:hover { background-color: rgba(${rgb}, 0.1) !important; }
      .hover\\:text-primary-300:hover { color: ${hover} !important; }
    `;

    this.styleElement = this.renderer.createElement('style');
    this.styleElement!.setAttribute('id', 'dynamic-theme');
    this.styleElement!.textContent = css;
    this.renderer.appendChild(document.head, this.styleElement);
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
