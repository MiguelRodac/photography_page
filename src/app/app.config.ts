import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

import { AUTH_SERVICE } from './core/tokens/auth-service.token';
import { PORTFOLIO_SERVICE } from './core/tokens/portfolio-service.token';
import { CONTENT_SERVICE } from './core/tokens/content-service.token';
import { PACKAGE_SERVICE } from './core/tokens/package-service.token';
import { CATEGORIES_SERVICE } from './core/tokens/categories-service.token';
import { NAVIGATION_SERVICE } from './core/tokens/navigation-service.token';
import { FirebaseAuthService } from './infrastructure/firebase/firebase-auth.service';
import { FirebasePortfolioService } from './infrastructure/firebase/firebase-portfolio.service';
import { FirebaseContentService } from './infrastructure/firebase/firebase-content.service';
import { FirebasePackageService } from './infrastructure/firebase/firebase-package.service';
import { FirebaseCategoriesService } from './infrastructure/firebase/firebase-categories.service';
import { FirebaseNavigationService } from './infrastructure/firebase/firebase-navigation.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    { provide: AUTH_SERVICE, useClass: FirebaseAuthService },
    { provide: PORTFOLIO_SERVICE, useClass: FirebasePortfolioService },
    { provide: CONTENT_SERVICE, useClass: FirebaseContentService },
    { provide: PACKAGE_SERVICE, useClass: FirebasePackageService },
    { provide: CATEGORIES_SERVICE, useClass: FirebaseCategoriesService },
    { provide: NAVIGATION_SERVICE, useClass: FirebaseNavigationService },
  ],
};
