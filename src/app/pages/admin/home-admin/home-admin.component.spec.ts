import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { HomeAdminComponent } from './home-admin.component';
import { AUTH_SERVICE } from '../../../core/tokens/auth-service.token';
import { IAuthService, AuthUser } from '../../../core/interfaces/auth-service.interface';

describe('HomeAdminComponent', () => {
  let component: HomeAdminComponent;
  let fixture: ComponentFixture<HomeAdminComponent>;
  let mockAuthService: jasmine.SpyObj<IAuthService>;
  let router: Router;

  const mockUser: AuthUser = {
    uid: 'uid-1',
    email: 'admin@test.com',
    displayName: 'Admin User',
    role: 'admin',
  };

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('IAuthService', ['logout'], {
      authState$: of(mockUser),
      getCurrentUser: mockUser,
      hasRole: true,
    });

    await TestBed.configureTestingModule({
      imports: [HomeAdminComponent],
      providers: [
        { provide: AUTH_SERVICE, useValue: mockAuthService },
        provideRouter([]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(HomeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('User display', () => {
    it('should display current user email', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('admin@test.com');
    });

    it('should expose user$ observable for template', () => {
      component.user$.subscribe((user) => {
        expect(user).toEqual(mockUser);
      });
    });
  });

  describe('Navigation cards', () => {
    it('should have navigation links to admin sections', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const links = compiled.querySelectorAll('a');
      const linkTexts = Array.from(links).map((a) => a.textContent?.trim());

      expect(linkTexts.some((t) => t?.includes('Portfolio'))).toBeTrue();
      expect(linkTexts.some((t) => t?.includes('Content'))).toBeTrue();
      expect(linkTexts.some((t) => t?.includes('Packages'))).toBeTrue();
    });

    it('should have at least 3 navigation cards', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const cards = compiled.querySelectorAll('a');
      expect(cards.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Logout', () => {
    it('should have a logout button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const logoutBtn = compiled.querySelector('button');
      expect(logoutBtn).toBeTruthy();
      expect(logoutBtn?.textContent).toContain('Logout');
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
});
