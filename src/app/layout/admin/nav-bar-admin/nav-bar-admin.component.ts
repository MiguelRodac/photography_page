import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { AUTH_SERVICE } from '../../../core/tokens/auth-service.token';
import { IAuthService, AuthUser } from '../../../core/interfaces/auth-service.interface';

@Component({
  selector: 'app-nav-bar-admin',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './nav-bar-admin.component.html',
})
export class NavBarAdminComponent {
  private readonly authService = inject<IAuthService>(AUTH_SERVICE);
  private readonly router = inject(Router);

  readonly mobileMenuOpen = signal(false);
  readonly user$: Observable<AuthUser | null> = this.authService.authState$;

  readonly navLinks = [
    { label: 'Dashboard', link: '/admin-page' },
    { label: 'Portfolio', link: '/admin-page/portfolio' },
    { label: 'Content', link: '/admin-page/content' },
    { label: 'Packages', link: '/admin-page/packages' },
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/admin-page/login']);
  }
}
