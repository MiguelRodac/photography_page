import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav>
      <!-- Desktop -->
      <div class="hidden md:flex items-center gap-1">
        @for (link of links; track link.path) {
          <a [routerLink]="link.path"
             routerLinkActive="bg-primary-500/10 text-primary-600 dark:text-primary-400"
             [routerLinkActiveOptions]="{ exact: link.path === '/' }"
             class="px-4 py-2 rounded-lg text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            {{ link.label }}
          </a>
        }
      </div>

      <!-- Mobile -->
      <div class="md:hidden">
        <button (click)="toggleMobileMenu()" type="button"
                class="p-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
                aria-controls="mobile-menu"
                [attr.aria-expanded]="!classMobile">
          <span class="sr-only">Open main menu</span>
          <svg [class.hidden]="!classMobile" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <svg [class.hidden]="classMobile" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      @if (!classMobile) {
        <div class="absolute top-20 left-0 right-0 bg-surface-50 dark:bg-surface-950 border-b border-surface-200 dark:border-surface-800 shadow-lg md:hidden">
          <div class="px-4 py-3 space-y-1">
            @for (link of links; track link.path) {
              <a [routerLink]="link.path"
                 (click)="toggleMobileMenu()"
                 routerLinkActive="bg-primary-500/10 text-primary-600 dark:text-primary-400"
                 [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                 class="block px-4 py-3 rounded-lg text-base font-medium text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                {{ link.label }}
              </a>
            }
          </div>
        </div>
      }
    </nav>
  `,
})
export class NavBarComponent {
  classMobile = true;

  links = [
    { path: '/', label: 'INICIO' },
    { path: '/about-me', label: 'SOBRE MI' },
    { path: '/portfolio', label: 'PORTAFOLIO' },
    { path: '/contact', label: 'CONTACTO' },
  ];

  toggleMobileMenu(): void {
    this.classMobile = !this.classMobile;
  }
}
