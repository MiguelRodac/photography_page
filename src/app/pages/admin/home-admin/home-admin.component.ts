import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AUTH_SERVICE } from '../../../core/tokens/auth-service.token';
import { IAuthService, AuthUser } from '../../../core/interfaces/auth-service.interface';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './home-admin.component.html',
})
export class HomeAdminComponent {
  private readonly authService = inject(AUTH_SERVICE);
  private readonly router = inject(Router);

  readonly user$: Observable<AuthUser | null> = this.authService.authState$;

  readonly navCards = [
    { title: 'Portfolio', description: 'Manage your portfolio items', link: '/admin-page/portfolio', icon: '📷' },
    { title: 'Content', description: 'Edit page content sections', link: '/admin-page/content', icon: '📝' },
    { title: 'Packages', description: 'Manage service packages', link: '/admin-page/packages', icon: '📦' },
  ];

  async onLogout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/admin-page/login']);
  }
}
