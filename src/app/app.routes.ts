import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AboutMeComponent } from './pages/about-me/about-me.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { AdminLayoutComponent } from './layout/admin/admin-layout/admin-layout.component';
import { HomeAdminComponent } from './pages/admin/home-admin/home-admin.component';
import { HomeV0Component } from './pages/home-v0/home-v0.component';

export const routes: Routes = [
  { path: '', component: MainLayoutComponent, children: [
    {path: '', component: HomeComponent},
    { path: 'about-me', component: AboutMeComponent },
    { path: 'portfolio', component: PortfolioComponent},
    { path: 'contact', component: ContactComponent },
  ]}, // Ruta raíz - Users view
  { path: 'home-v0', component: HomeV0Component },
  { path: 'admin-page', component: AdminLayoutComponent, children: [
    {path: '', component: HomeAdminComponent},
    // { path: 'about-me', component: AboutMeComponent },
    // { path: 'portfolio', component: PortfolioComponent},
    // { path: 'contact', component: ContactComponent },
  ]}, // Ruta raíz - Management Page
  { path: '**', component: PageNotFoundComponent }, // Ruta comodín (404)
];
