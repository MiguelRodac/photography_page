import { Routes } from '@angular/router';

export const routes: Routes = [
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
  {
    path: 'admin-page',
    loadComponent: () => import('./layout/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/admin/home-admin/home-admin.component').then(m => m.HomeAdminComponent) },
    ],
  },
  { path: '**', loadComponent: () => import('./pages/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent) },
];
