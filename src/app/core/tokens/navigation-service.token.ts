import { InjectionToken } from '@angular/core';
import { INavigationService } from '../interfaces/navigation-service.interface';

export const NAVIGATION_SERVICE = new InjectionToken<INavigationService>('INavigationService');
