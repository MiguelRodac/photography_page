import { InjectionToken } from '@angular/core';
import { IPackageService } from '../interfaces/package-service.interface';

export const PACKAGE_SERVICE = new InjectionToken<IPackageService>('IPackageService');
