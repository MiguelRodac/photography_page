import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import portfolioData from '../../data/portfolio.json';
import servicesData from '../../data/services.json';
import siteContent from '../../data/site-content.json';

@Injectable({
  providedIn: 'root'
})
export class GlobalResourceService {

  getSiteName(): string {
    return environment.siteName;
  }

  getFooterText(): string {
    return `© ${new Date().getFullYear()} ${environment.siteName}. All Rights Reserved.`;
  }

  getSocialMediaLinks(social: string): string {
    const links: Record<string, string> = environment.socialMedia;
    return links[social] || '';
  }

  getWhatsAppLink(): string {
    return environment.socialMedia.whatsapp;
  }

  getPortfolioItems(): typeof portfolioData {
    return portfolioData;
  }

  getServices(): typeof servicesData {
    return servicesData;
  }

  getSiteContent(): typeof siteContent {
    return siteContent;
  }
}
