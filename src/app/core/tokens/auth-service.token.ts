import { InjectionToken } from '@angular/core';
import { IAuthService } from '../interfaces/auth-service.interface';

export const AUTH_SERVICE = new InjectionToken<IAuthService>('IAuthService');
