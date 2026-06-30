import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AUTH_SERVICE } from '../../../core/tokens/auth-service.token';
import { AuthUser } from '../../../core/interfaces/auth-service.interface';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './home-admin.component.html',
})
export class HomeAdminComponent {
  private readonly authService = inject(AUTH_SERVICE);
  private readonly router = inject(Router);

  readonly i18n = inject(I18nService);
  readonly user$: Observable<AuthUser | null> = this.authService.authState$;

  readonly navCards = [
    { title: () => this.i18n.t('DASHBOARD.PORTFOLIO'), description: () => this.i18n.t('DASHBOARD.PORTFOLIO_DESC'), link: '/admin-page/portfolio', icon: 'photo' },
    { title: () => this.i18n.t('DASHBOARD.CONTENT'), description: () => this.i18n.t('DASHBOARD.CONTENT_DESC'), link: '/admin-page/content', icon: 'document' },
    { title: () => this.i18n.t('DASHBOARD.CATEGORIES'), description: () => this.i18n.t('DASHBOARD.CATEGORIES_DESC'), link: '/admin-page/categories', icon: 'tag' },
    { title: () => this.i18n.t('DASHBOARD.NAVIGATION'), description: () => this.i18n.t('DASHBOARD.NAVIGATION_DESC'), link: '/admin-page/navigation', icon: 'link' },
    { title: () => this.i18n.t('DASHBOARD.SETTINGS'), description: () => this.i18n.t('DASHBOARD.SETTINGS_DESC'), link: '/admin-page/settings', icon: 'cog' },
    { title: () => this.i18n.t('DASHBOARD.DATA'), description: () => this.i18n.t('DASHBOARD.DATA_DESC'), link: '/admin-page/data', icon: 'database' },
  ];

  async onLogout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/admin-page/login']);
  }
}
