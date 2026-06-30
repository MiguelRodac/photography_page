import { InjectionToken } from '@angular/core';
import { AUTH_SERVICE } from './auth-service.token';
import { PORTFOLIO_SERVICE } from './portfolio-service.token';
import { CONTENT_SERVICE } from './content-service.token';
import { CATEGORIES_SERVICE } from './categories-service.token';

describe('DI Injection Tokens', () => {
  it('should create AUTH_SERVICE as an InjectionToken', () => {
    expect(AUTH_SERVICE).toBeDefined();
    expect(AUTH_SERVICE).toBeInstanceOf(InjectionToken);
    expect(AUTH_SERVICE.toString()).toContain('IAuthService');
  });

  it('should create PORTFOLIO_SERVICE as an InjectionToken', () => {
    expect(PORTFOLIO_SERVICE).toBeDefined();
    expect(PORTFOLIO_SERVICE).toBeInstanceOf(InjectionToken);
    expect(PORTFOLIO_SERVICE.toString()).toContain('IPortfolioService');
  });

  it('should create CONTENT_SERVICE as an InjectionToken', () => {
    expect(CONTENT_SERVICE).toBeDefined();
    expect(CONTENT_SERVICE).toBeInstanceOf(InjectionToken);
    expect(CONTENT_SERVICE.toString()).toContain('IContentService');
  });

  it('should create CATEGORIES_SERVICE as an InjectionToken', () => {
    expect(CATEGORIES_SERVICE).toBeDefined();
    expect(CATEGORIES_SERVICE).toBeInstanceOf(InjectionToken);
    expect(CATEGORIES_SERVICE.toString()).toContain('ICategoriesService');
  });

  it('should have unique token instances for each service', () => {
    const tokens = [AUTH_SERVICE, PORTFOLIO_SERVICE, CONTENT_SERVICE, CATEGORIES_SERVICE];
    const uniqueTokens = new Set(tokens);
    expect(uniqueTokens.size).toBe(4);
  });
});
