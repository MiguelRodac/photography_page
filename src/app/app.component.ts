import { Component, inject, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ThemeLoaderService } from './services/theme-loader.service';
import { PublicContentCacheService } from './services/public-content-cache.service';
import { Subscription, filter, take } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html' })
export class AppComponent implements OnInit, OnDestroy {
  private readonly themeLoader = inject(ThemeLoaderService);
  private readonly contentCache = inject(PublicContentCacheService);
  private readonly titleService = inject(Title);
  private readonly renderer = inject(Renderer2);
  private readonly router = inject(Router);
  private sub?: Subscription;

  ngOnInit(): void {
    // Clear stale localStorage content cache
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('content_')) keysToRemove.push(key);
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));

    this.themeLoader.loadTheme();
    this.loadSiteIdentity();

    // Reload on each navigation (catches data changes without refresh)
    this.sub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.loadSiteIdentity());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    // Clean up on destroy
    this.titleService.setTitle('');
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.remove();
  }

  private loadSiteIdentity(): void {
    this.contentCache.getSection<{ siteName?: string; logoUrl?: string }>('header')
      .pipe(take(1))
      .subscribe((data) => {
        if (data?.siteName) {
          this.titleService.setTitle(data.siteName);
          document.title = data.siteName;
        } else {
          this.titleService.setTitle('');
          document.title = '';
        }
        if (data?.logoUrl) {
          this.updateFavicon(data.logoUrl);
        } else {
          this.updateFavicon('');
        }
      });
  }

  private updateFavicon(url: string): void {
    const existing = document.querySelector('link[rel="icon"]');
    if (!url) {
      if (existing) existing.remove();
      return;
    }
    let link = existing as HTMLLinkElement;
    if (!link) {
      link = this.renderer.createElement('link') as HTMLLinkElement;
      this.renderer.setAttribute(link, 'rel', 'icon');
      this.renderer.setAttribute(link, 'type', 'image/svg+xml');
      this.renderer.appendChild(document.head, link);
    }
    this.renderer.setAttribute(link, 'href', url);
  }
}
