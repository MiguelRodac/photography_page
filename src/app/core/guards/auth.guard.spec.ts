import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, Observable, firstValueFrom } from 'rxjs';
import { authGuard } from './auth.guard';
import { AUTH_SERVICE } from '../../core/tokens/auth-service.token';
import { IAuthService, AuthUser } from '../../core/interfaces/auth-service.interface';

describe('authGuard', () => {
  const mockUser: AuthUser = {
    uid: 'uid-1',
    email: 'admin@test.com',
    displayName: 'Admin',
    role: 'admin',
  };

  function createMockAuth(authStateValue: AuthUser | null, hasRoleResult = true): IAuthService {
    return {
      authState$: of(authStateValue),
      login: jasmine.createSpy('login').and.resolveTo(),
      logout: jasmine.createSpy('logout').and.resolveTo(),
      hasRole: jasmine.createSpy('hasRole').and.returnValue(hasRoleResult),
      getCurrentUser: () => authStateValue,
      sendPasswordResetEmail: jasmine.createSpy('sendPasswordResetEmail').and.resolveTo(),
    };
  }

  function runGuard(route: any, state: any, mockAuth: IAuthService): Observable<any> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: AUTH_SERVICE, useValue: mockAuth }],
    });
    const router = TestBed.inject(Router);
    spyOn(router, 'createUrlTree').and.callThrough();
    return TestBed.runInInjectionContext(() => authGuard(route, state)) as Observable<any>;
  }

  it('should allow access when user is authenticated', (done) => {
    const mockAuth = createMockAuth(mockUser);
    const route = { data: {} } as any;
    const state = { url: '/admin-page' } as any;

    runGuard(route, state, mockAuth).subscribe((result: any) => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should redirect to login when user is not authenticated', (done) => {
    const mockAuth = createMockAuth(null);
    const route = { data: {} } as any;
    const state = { url: '/admin-page' } as any;

    runGuard(route, state, mockAuth).subscribe((result: any) => {
      expect(result.toString()).toContain('/admin-page/login');
      done();
    });
  });

  it('should redirect to unauthorized when user has insufficient role', (done) => {
    const mockAuth = createMockAuth(mockUser, false);
    const route = { data: { requiredRole: 'super-admin' } } as any;
    const state = { url: '/admin-page' } as any;

    runGuard(route, state, mockAuth).subscribe((result: any) => {
      expect(result.toString()).toContain('/admin-page/unauthorized');
      done();
    });
  });

  it('should allow access when user has required role', (done) => {
    const mockAuth = createMockAuth(mockUser, true);
    const route = { data: { requiredRole: 'admin' } } as any;
    const state = { url: '/admin-page' } as any;

    runGuard(route, state, mockAuth).subscribe((result: any) => {
      expect(result).toBeTrue();
      done();
    });
  });
});
