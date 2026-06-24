import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { GlobalResourceService } from '../../services/global-resource.service';
import { PublicContentCacheService } from '../../services/public-content-cache.service';
import { environment } from '../../../environments/environment';

interface SocialLink {
  platform: string;
  url: string;
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html' })
export class FooterComponent implements OnInit {
  private readonly resource = inject(GlobalResourceService);
  private readonly contentCache = inject(PublicContentCacheService);

  readonly siteName = signal(environment.siteName);
  readonly copyrightText = signal(
    `© ${new Date().getFullYear()} ${environment.siteName}. All Rights Reserved.`
  );
  readonly socialLinks = signal<SocialLink[]>([
    { platform: 'instagram', url: environment.socialMedia.instagram },
    { platform: 'whatsapp', url: environment.socialMedia.whatsapp },
  ]);

  ngOnInit(): void {
    this.contentCache.getSection<Record<string, unknown>>('footer').pipe(take(1)).subscribe(data => {
      if (data?.['copyrightText']) this.copyrightText.set(data['copyrightText'] as string);
      if (data?.['socialLinks']) {
        const links = data['socialLinks'] as SocialLink[];
        if (links.length > 0) this.socialLinks.set(links);
      }
    });
  }

  get title(): string {
    return this.siteName();
  }

  get footerText(): string {
    return this.copyrightText();
  }

  getSocialUrl(platform: string): string {
    return this.socialLinks().find(l => l.platform === platform)?.url || '';
  }
}
