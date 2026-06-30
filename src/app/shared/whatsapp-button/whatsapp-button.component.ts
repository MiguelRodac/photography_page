import { Component, inject, OnInit, signal } from '@angular/core';
import { take } from 'rxjs';
import { GlobalResourceService } from '../../services/global-resource.service';
import { PublicContentCacheService } from '../../services/public-content-cache.service';

@Component({
  selector: 'app-whatsapp-button',
  imports: [],
  template: `
    <a [href]="whatsappLink"
       target="_blank"
       rel="noopener noreferrer"
       class="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center rounded-full text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
       [style.background-color]="bgColor()"
       [attr.aria-label]="ariaLabel()"
       [title]="tooltip()">
      <span class="iconify text-2xl text-white" data-icon="mdi:whatsapp"></span>
      <span class="absolute -top-12 right-0 bg-surface-900 dark:bg-white text-white dark:text-surface-900 text-xs px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {{ tooltip() }}
      </span>
    </a>
  `,
  standalone: true,
})
export class WhatsAppButtonComponent implements OnInit {
  private readonly resource = inject(GlobalResourceService);
  private readonly contentCache = inject(PublicContentCacheService);

  whatsappLink = this.resource.getWhatsAppLink();
  readonly tooltip = signal('');
  readonly ariaLabel = signal('');
  readonly bgColor = signal('#22c55e');

  ngOnInit(): void {
    this.contentCache.getSection<Record<string, unknown>>('whatsapp').pipe(take(1)).subscribe(data => {
      if (data) {
        if (data['buttonTooltip']) this.tooltip.set(data['buttonTooltip'] as string);
        if (data['buttonAriaLabel']) this.ariaLabel.set(data['buttonAriaLabel'] as string);
        if (data['buttonColor']) this.bgColor.set(data['buttonColor'] as string);
      }
    });
  }
}
