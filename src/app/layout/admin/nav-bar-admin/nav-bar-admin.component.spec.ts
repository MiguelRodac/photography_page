import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { NavBarAdminComponent } from './nav-bar-admin.component';
import { AUTH_SERVICE } from '../../../core/tokens/auth-service.token';
import { IAuthService, AuthUser } from '../../../core/interfaces/auth-service.interface';

describe('NavBarAdminComponent', () => {
  let component: NavBarAdminComponent;
  let fixture: ComponentFixture<NavBarAdminComponent>;
  let mockAuthService: jasmine.SpyObj<IAuthService>;
  let router: Router;

  const mockUser: AuthUser = {
    uid: 'uid-1',
    email: 'admin@test.com',
    displayName: 'Admin',
    role: 'admin',
  };

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('IAuthService', ['logout'], {
      authState$: of(mockUser),
      getCurrentUser: mockUser,
      hasRole: true,
    });

    await TestBed.configureTestingModule({
      imports: [NavBarAdminComponent],
      providers: [
        { provide: AUTH_SERVICE, useValue: mockAuthService },
        provideRouter([]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(NavBarAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Navigation links', () => {
    it('should render navigation links', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const links = compiled.querySelectorAll('a');
      const linkTexts = Array.from(links).map((a) => a.textContent?.trim());

      expect(linkTexts.some((t) => t?.includes('Dashboard'))).toBeTrue();
      expect(linkTexts.some((t) => t?.includes('Portfolio'))).toBeTrue();
      expect(linkTexts.some((t) => t?.includes('Categories'))).toBeTrue();
      expect(linkTexts.some((t) => t?.includes('Content'))).toBeTrue();
    });

    it('should have at least 4 nav links', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const links = compiled.querySelectorAll('a');
      expect(links.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('User display', () => {
    it('should display user email', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('admin@test.com');
    });
  });

  describe('Logout', () => {
    it('should have a logout button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('button');
      const logoutBtn = Array.from(buttons).find((b) => b.textContent?.includes('Logout'));
      expect(logoutBtn).toBeTruthy();
    });

    it('should call authService.logout on logout', async () => {
      mockAuthService.logout.and.resolveTo();
      await component.onLogout();
      expect(mockAuthService.logout).toHaveBeenCalled();
    });

    it('should navigate to login after logout', async () => {
      mockAuthService.logout.and.resolveTo();
      await component.onLogout();
      expect(router.navigate).toHaveBeenCalledWith(['/admin-page/login']);
    });
  });

  describe('Mobile menu', () => {
    it('should toggle mobile menu', () => {
      expect(component.mobileMenuOpen()).toBeFalse();
      component.toggleMobileMenu();
      expect(component.mobileMenuOpen()).toBeTrue();
      component.toggleMobileMenu();
      expect(component.mobileMenuOpen()).toBeFalse();
    });
  });
});
