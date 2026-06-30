import { Observable, of } from 'rxjs';
import { IAuthService, AuthUser } from './auth-service.interface';
import { IPortfolioService } from './portfolio-service.interface';
import { IContentService } from './content-service.interface';
import { PortfolioDoc } from './firestore-models';

describe('Service Interfaces', () => {
  describe('IAuthService', () => {
    it('should allow a mock implementation with all required members', () => {
      const mockUser: AuthUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'admin',
      };

      const mock: IAuthService = {
        authState$: of(mockUser),
        login: (email: string, password: string) => Promise.resolve(),
        logout: () => Promise.resolve(),
        hasRole: (role: string) => true,
        getCurrentUser: () => mockUser,
        sendPasswordResetEmail: (email: string) => Promise.resolve(),
      };

      expect(mock.authState$).toBeInstanceOf(Observable);
      expect(typeof mock.login).toBe('function');
      expect(typeof mock.logout).toBe('function');
      expect(typeof mock.hasRole).toBe('function');
      expect(typeof mock.getCurrentUser).toBe('function');
      expect(typeof mock.sendPasswordResetEmail).toBe('function');
      expect(mock.getCurrentUser()?.uid).toBe('test-uid');
      expect(mock.hasRole('admin')).toBeTrue();
    });

    it('should support null auth state for unauthenticated users', () => {
      const mock: IAuthService = {
        authState$: of(null),
        login: jasmine.createSpy('login').and.resolveTo(),
        logout: jasmine.createSpy('logout').and.resolveTo(),
        hasRole: jasmine.createSpy('hasRole').and.returnValue(false),
        getCurrentUser: () => null,
        sendPasswordResetEmail: jasmine.createSpy('sendPasswordResetEmail').and.resolveTo(),
      };

      expect(mock.getCurrentUser()).toBeNull();
      expect(mock.hasRole('admin')).toBeFalse();
    });
  });

  describe('IPortfolioService', () => {
    it('should allow a mock implementation with all required methods', () => {
      const mockDoc: PortfolioDoc = {
        id: 'doc-1',
        title: 'Test',
        description: 'Desc',
        category: 'wedding',
        img: 'url',
        imageSource: 'url',
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mock: IPortfolioService = {
        getAll: () => of([mockDoc]),
        getById: (id: string) => of(mockDoc),
        create: (item: any) => Promise.resolve('new-id'),
        update: (id: string, item: any) => Promise.resolve(),
        softDelete: (id: string) => Promise.resolve(),
        uploadImage: (file: File, onProgress?: (pct: number) => void) => Promise.resolve('url'),
      };

      expect(typeof mock.getAll).toBe('function');
      expect(typeof mock.getById).toBe('function');
      expect(typeof mock.create).toBe('function');
      expect(typeof mock.update).toBe('function');
      expect(typeof mock.softDelete).toBe('function');
      expect(typeof mock.uploadImage).toBe('function');
      expect(mock.create({} as any)).toBeInstanceOf(Promise);
    });
  });

  describe('IContentService', () => {
    it('should allow a mock implementation with generic section methods', () => {
      interface HeroContent { title: string; subtitle: string; cta: string; }

      const mock: IContentService = {
        getSection: <T>(sectionId: string) => of({ title: 'Hero', subtitle: 'Sub', cta: 'Click' } as T),
        updateSection: <T>(sectionId: string, data: T) => Promise.resolve(),
      };

      expect(typeof mock.getSection).toBe('function');
      expect(typeof mock.updateSection).toBe('function');
      expect(mock.getSection<HeroContent>('hero')).toBeInstanceOf(Observable);
    });
  });
});
