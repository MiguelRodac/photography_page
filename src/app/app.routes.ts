import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AboutMeComponent } from './pages/about-me/about-me.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';

export const routes: Routes = [
  { path: '', component: MainLayoutComponent, children: [
    {path: '', component: HomeComponent},
    { path: 'about-me', component: AboutMeComponent },
    { path: 'portfolio', component: PortfolioComponent},
    { path: 'contact', component: ContactComponent },
  ]}, // Ruta raíz
  { path: '**', component: PageNotFoundComponent }, // Ruta comodín (404)
];
