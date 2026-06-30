import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GlobalResourceService {

  getSiteName(): string { return ''; }

  getFooterText(): string { return ''; }

  getSocialMediaLinks(social: string): string { return ''; }

  getWhatsAppLink(): string { return 'https://wa.me/'; }

  getPortfolioItems(): any[] { return []; }

  getServices(): any[] { return []; }

  getSiteContent(): any { return {}; }
}
