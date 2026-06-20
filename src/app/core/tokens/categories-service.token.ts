import { InjectionToken } from '@angular/core';
import { ICategoriesService } from '../interfaces/categories-service.interface';

export const CATEGORIES_SERVICE = new InjectionToken<ICategoriesService>('ICategoriesService');
