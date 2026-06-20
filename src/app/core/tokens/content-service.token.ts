import { InjectionToken } from '@angular/core';
import { IContentService } from '../interfaces/content-service.interface';

export const CONTENT_SERVICE = new InjectionToken<IContentService>('IContentService');
