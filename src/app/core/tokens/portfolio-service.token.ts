import { InjectionToken } from '@angular/core';
import { IPortfolioService } from '../interfaces/portfolio-service.interface';

export const PORTFOLIO_SERVICE = new InjectionToken<IPortfolioService>('IPortfolioService');
