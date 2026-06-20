import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AUTH_SERVICE } from '../../../core/tokens/auth-service.token';
import { IAuthService, AuthUser } from '../../../core/interfaces/auth-service.interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<IAuthService>;
  let router: Router;

  const mockUser: AuthUser = {
    uid: 'uid-1',
    email: 'admin@test.com',
    displayName: 'Admin',
    role: 'admin',
  };

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('IAuthService', ['login', 'logout'], {
      authState$: of(null),
      getCurrentUser: null,
      hasRole: true,
    });

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AUTH_SERVICE, useValue: mockAuthService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Form validation', () => {
    beforeEach(() => fixture.detectChanges());

    it('should have invalid form when empty', () => {
      expect(component.loginForm.valid).toBeFalse();
    });

    it('should require email', () => {
      component.loginForm.controls['password'].setValue('123456');
      expect(component.loginForm.controls['email'].valid).toBeFalse();
      expect(component.loginForm.controls['email'].hasError('required')).toBeTrue();
    });

    it('should require password', () => {
      component.loginForm.controls['email'].setValue('admin@test.com');
      expect(component.loginForm.controls['password'].valid).toBeFalse();
      expect(component.loginForm.controls['password'].hasError('required')).toBeTrue();
    });

    it('should require valid email format', () => {
      component.loginForm.controls['email'].setValue('invalid-email');
      expect(component.loginForm.controls['email'].hasError('email')).toBeTrue();
    });

    it('should have valid form with correct email and password', () => {
      component.loginForm.controls['email'].setValue('admin@test.com');
      component.loginForm.controls['password'].setValue('123456');
      expect(component.loginForm.valid).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => fixture.detectChanges());

    it('should not call login if form is invalid', fakeAsync(() => {
      component.onSubmit();
      tick();
      expect(mockAuthService.login).not.toHaveBeenCalled();
    }));

    it('should call login with email and password on valid submit', fakeAsync(() => {
      mockAuthService.login.and.resolveTo();
      component.loginForm.controls['email'].setValue('admin@test.com');
      component.loginForm.controls['password'].setValue('123456');

      component.onSubmit();
      tick();

      expect(mockAuthService.login).toHaveBeenCalledWith('admin@test.com', '123456');
    }));

    it('should set loading state during login', fakeAsync(() => {
      mockAuthService.login.and.resolveTo();
      component.loginForm.controls['email'].setValue('admin@test.com');
      component.loginForm.controls['password'].setValue('123456');

      expect(component.loading()).toBeFalse();
      component.onSubmit();
      // Loading is set synchronously before the await
      expect(component.loading()).toBeTrue();
      tick();
      expect(component.loading()).toBeFalse();
    }));

    it('should navigate to /admin-page on successful login', fakeAsync(() => {
      mockAuthService.login.and.resolveTo();
      component.loginForm.controls['email'].setValue('admin@test.com');
      component.loginForm.controls['password'].setValue('123456');

      component.onSubmit();
      tick();

      expect(router.navigate).toHaveBeenCalledWith(['/admin-page']);
    }));

    it('should display error message on login failure', fakeAsync(() => {
      const error = new Error('Invalid credentials');
      mockAuthService.login.and.rejectWith(error);
      component.loginForm.controls['email'].setValue('admin@test.com');
      component.loginForm.controls['password'].setValue('wrong');

      component.onSubmit();
      tick();

      expect(component.errorMessage()).toBeTruthy();
      expect(component.loading()).toBeFalse();
    }));

    it('should clear error message on new submit attempt', fakeAsync(() => {
      const error = new Error('Invalid credentials');
      mockAuthService.login.and.rejectWith(error);
      component.loginForm.controls['email'].setValue('admin@test.com');
      component.loginForm.controls['password'].setValue('wrong');

      component.onSubmit();
      tick();
      expect(component.errorMessage()).toBeTruthy();

      mockAuthService.login.and.resolveTo();
      component.onSubmit();
      tick();
      expect(component.errorMessage()).toBeNull();
    }));
  });

  describe('Already authenticated redirect', () => {
    it('should redirect to /admin-page if user is already authenticated on init', fakeAsync(() => {
      mockAuthService = jasmine.createSpyObj('IAuthService', ['login', 'logout'], {
        authState$: of(mockUser),
        getCurrentUser: mockUser,
        hasRole: true,
      });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [LoginComponent],
        providers: [{ provide: AUTH_SERVICE, useValue: mockAuthService }],
      });

      router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      tick();

      expect(router.navigate).toHaveBeenCalledWith(['/admin-page']);
    }));
  });
});
