import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { AUTH_SERVICE } from '../../../core/tokens/auth-service.token';
import { IAuthService, AuthUser } from '../../../core/interfaces/auth-service.interface';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-nav-bar-admin',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './nav-bar-admin.component.html',
})
export class NavBarAdminComponent {
  private readonly authService = inject<IAuthService>(AUTH_SERVICE);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  readonly mobileMenuOpen = signal(false);
  readonly user$: Observable<AuthUser | null> = this.authService.authState$;

  readonly navLinks = [
    { label: () => this.i18n.t('NAV.DASHBOARD'), link: '/admin-page', icon: 'home' },
    { label: () => this.i18n.t('NAV.PORTFOLIO'), link: '/admin-page/portfolio', icon: 'photo' },
    { label: () => this.i18n.t('NAV.CATEGORIES'), link: '/admin-page/categories', icon: 'tag' },
    { label: () => this.i18n.t('NAV.CONTENT'), link: '/admin-page/content', icon: 'document' },
    { label: () => this.i18n.t('NAV.NAVIGATION'), link: '/admin-page/navigation', icon: 'link' },
    { label: () => this.i18n.t('NAV.SETTINGS'), link: '/admin-page/settings', icon: 'cog' },
    { label: () => this.i18n.t('NAV.DATA'), link: '/admin-page/data', icon: 'database' },
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/admin-page/login']);
  }
}
