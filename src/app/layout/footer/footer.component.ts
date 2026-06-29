import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { GlobalResourceService } from '../../services/global-resource.service';
import { PublicContentCacheService } from '../../services/public-content-cache.service';
import { NAVIGATION_SERVICE } from '../../core/tokens/navigation-service.token';
import { NavLinkDoc } from '../../core/interfaces/firestore-models';
import { environment } from '../../../environments/environment';

interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

interface FooterNavLink {
  path: string;
  label: string;
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html' })
export class FooterComponent implements OnInit {
  private readonly resource = inject(GlobalResourceService);
  private readonly contentCache = inject(PublicContentCacheService);
  private readonly navService = inject(NAVIGATION_SERVICE, { optional: true });

  readonly siteName = signal('');
  readonly logoUrl = signal('');
  readonly copyrightText = signal('');
  readonly tagline = signal('');
  readonly linksTitle = signal('');
  readonly socialTitle = signal('');
  readonly navLinks = signal<FooterNavLink[]>([]);
  readonly socialLinks = signal<SocialLink[]>([
    { platform: 'instagram', url: environment.socialMedia.instagram, icon: 'Ig' },
    { platform: 'whatsapp', url: environment.socialMedia.whatsapp, icon: 'Wa' },
  ]);

  ngOnInit(): void {
    this.contentCache.getSection<Record<string, unknown>>('footer').pipe(take(1)).subscribe(data => {
      if (data) {
        if (data['copyrightText']) this.copyrightText.set(data['copyrightText'] as string);
        if (data['tagline']) this.tagline.set(data['tagline'] as string);
        if (data['linksTitle']) this.linksTitle.set(data['linksTitle'] as string);
        if (data['socialTitle']) this.socialTitle.set(data['socialTitle'] as string);
        if (data['logoUrl']) this.logoUrl.set(data['logoUrl'] as string);
        if (data['socialLinks']) {
          const links = data['socialLinks'] as SocialLink[];
          if (links.length > 0) this.socialLinks.set(links);
        }
      }
    });

    if (this.navService) {
      this.navService.getAll().pipe(take(1)).subscribe(docs => {
        const visible = docs
          .filter((d: NavLinkDoc) => d.visible)
          .sort((a: NavLinkDoc, b: NavLinkDoc) => a.order - b.order)
          .map((d: NavLinkDoc) => ({ path: d.path, label: d.label }));
        this.navLinks.set(visible);
      });
    }
  }

  get title(): string {
    return this.siteName();
  }

  get footerText(): string {
    return this.copyrightText();
  }
}
