import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public routes (unchanged)
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'about-me', loadComponent: () => import('./pages/about-me/about-me.component').then(m => m.AboutMeComponent) },
      { path: 'portfolio', loadComponent: () => import('./pages/portfolio/portfolio.component').then(m => m.PortfolioComponent) },
      { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
    ],
  },
  // Login — OUTSIDE admin layout (no nav-bar, no header)
  {
    path: 'admin-page/login',
    loadComponent: () => import('./pages/admin/login/login.component').then(m => m.LoginComponent),
  },
  // Admin — guarded
  {
    path: 'admin-page',
    loadComponent: () => import('./layout/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./pages/admin/home-admin/home-admin.component').then(m => m.HomeAdminComponent) },
      { path: 'portfolio', loadComponent: () => import('./pages/admin/portfolio-admin/portfolio-admin.component').then(m => m.PortfolioAdminComponent) },
      { path: 'content', loadComponent: () => import('./pages/admin/content-admin/content-admin.component').then(m => m.ContentAdminComponent) },
      { path: 'packages', loadComponent: () => import('./pages/admin/packages-admin/packages-admin.component').then(m => m.PackagesAdminComponent) },
      { path: 'unauthorized', loadComponent: () => import('./pages/admin/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) },
    ],
  },
  { path: '**', loadComponent: () => import('./pages/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent) },
];
