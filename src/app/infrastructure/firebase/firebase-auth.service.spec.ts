import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { FirebaseAuthService } from './firebase-auth.service';
import { AuthUser } from '../../core/interfaces/auth-service.interface';

describe('FirebaseAuthService', () => {
  let service: FirebaseAuthService;
  let mockAuth: any;
  let mockFirestore: any;

  const mockFirebaseUser = {
    uid: 'uid-1',
    email: 'admin@test.com',
    displayName: 'Admin User',
  };

  const mockUserDoc = { role: 'admin', email: 'admin@test.com', displayName: 'Admin User', createdAt: new Date() };

  beforeEach(() => {
    mockAuth = { currentUser: null };
    mockFirestore = {};

    TestBed.configureTestingModule({
      providers: [
        FirebaseAuthService,
        { provide: Auth, useValue: mockAuth },
        { provide: Firestore, useValue: mockFirestore },
      ],
    });

    service = TestBed.inject(FirebaseAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('authState$', () => {
    it('should emit null when no user is authenticated', fakeAsync(() => {
      spyOn(service as any, 'observeAuth').and.returnValue(of(null));

      let emitted: AuthUser | null = undefined as any;
      service.authState$.subscribe((val) => (emitted = val));
      tick();

      expect(emitted).toBeNull();
    }));

    it('should emit AuthUser with role when firebase user is authenticated', fakeAsync(() => {
      spyOn(service as any, 'observeAuth').and.returnValue(of(mockFirebaseUser));
      spyOn(service as any, 'getDocument').and.returnValue(
        Promise.resolve({ exists: () => true, data: () => mockUserDoc }),
      );

      let emitted: AuthUser | null = undefined as any;
      service.authState$.subscribe((val) => (emitted = val));
      tick(100);

      expect(emitted).not.toBeNull();
      expect(emitted!.uid).toBe('uid-1');
      expect(emitted!.email).toBe('admin@test.com');
      expect(emitted!.role).toBe('admin');
    }));
  });

  describe('login', () => {
    it('should call signIn with provided credentials', async () => {
      const spy = spyOn(service as any, 'signIn').and.returnValue(
        Promise.resolve({ user: mockFirebaseUser }),
      );
      spyOn(service as any, 'getDocument').and.returnValue(
        Promise.resolve({ exists: () => true, data: () => mockUserDoc }),
      );

      await service.login('admin@test.com', 'password123');
      expect(spy).toHaveBeenCalledWith('admin@test.com', 'password123');
    });

    it('should fetch user role from Firestore after successful login', async () => {
      spyOn(service as any, 'signIn').and.returnValue(Promise.resolve({ user: mockFirebaseUser }));
      spyOn(service as any, 'createDocRef').and.returnValue({});
      const docSpy = spyOn(service as any, 'getDocument').and.returnValue(
        Promise.resolve({ exists: () => true, data: () => mockUserDoc }),
      );

      await service.login('admin@test.com', 'password123');
      expect(docSpy).toHaveBeenCalled();
    });

    it('should update currentUser after successful login', async () => {
      spyOn(service as any, 'signIn').and.returnValue(Promise.resolve({ user: mockFirebaseUser }));
      spyOn(service as any, 'createDocRef').and.returnValue({});
      spyOn(service as any, 'getDocument').and.returnValue(
        Promise.resolve({ exists: () => true, data: () => mockUserDoc }),
      );

      await service.login('admin@test.com', 'password123');
      const user = service.getCurrentUser();
      expect(user).not.toBeNull();
      expect(user!.uid).toBe('uid-1');
      expect(user!.role).toBe('admin');
    });
  });

  describe('logout', () => {
    it('should call performSignOut', async () => {
      const spy = spyOn(service as any, 'performSignOut').and.returnValue(Promise.resolve());
      await service.logout();
      expect(spy).toHaveBeenCalled();
    });

    it('should clear currentUser after logout', async () => {
      spyOn(service as any, 'signIn').and.returnValue(Promise.resolve({ user: mockFirebaseUser }));
      spyOn(service as any, 'createDocRef').and.returnValue({});
      spyOn(service as any, 'getDocument').and.returnValue(
        Promise.resolve({ exists: () => true, data: () => mockUserDoc }),
      );
      spyOn(service as any, 'performSignOut').and.returnValue(Promise.resolve());

      await service.login('admin@test.com', 'password123');
      expect(service.getCurrentUser()).not.toBeNull();

      await service.logout();
      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('hasRole', () => {
    it('should return false when no user is logged in', () => {
      expect(service.hasRole('admin')).toBeFalse();
    });

    it('should return true when user has the required role', async () => {
      spyOn(service as any, 'signIn').and.returnValue(Promise.resolve({ user: mockFirebaseUser }));
      spyOn(service as any, 'createDocRef').and.returnValue({});
      spyOn(service as any, 'getDocument').and.returnValue(
        Promise.resolve({ exists: () => true, data: () => mockUserDoc }),
      );

      await service.login('admin@test.com', 'password123');
      expect(service.hasRole('admin')).toBeTrue();
    });

    it('should return true for super-admin regardless of required role', async () => {
      spyOn(service as any, 'signIn').and.returnValue(Promise.resolve({ user: mockFirebaseUser }));
      spyOn(service as any, 'createDocRef').and.returnValue({});
      spyOn(service as any, 'getDocument').and.returnValue(
        Promise.resolve({
          exists: () => true,
          data: () => ({ ...mockUserDoc, role: 'super-admin' }),
        }),
      );

      await service.login('super@test.com', 'password123');
      expect(service.hasRole('admin')).toBeTrue();
      expect(service.hasRole('employee')).toBeTrue();
    });

    it('should return false when user has insufficient role', async () => {
      spyOn(service as any, 'signIn').and.returnValue(Promise.resolve({ user: mockFirebaseUser }));
      spyOn(service as any, 'createDocRef').and.returnValue({});
      spyOn(service as any, 'getDocument').and.returnValue(
        Promise.resolve({
          exists: () => true,
          data: () => ({ ...mockUserDoc, role: 'employee' }),
        }),
      );

      await service.login('employee@test.com', 'password123');
      expect(service.hasRole('admin')).toBeFalse();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is logged in', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should return AuthUser after login', async () => {
      spyOn(service as any, 'signIn').and.returnValue(Promise.resolve({ user: mockFirebaseUser }));
      spyOn(service as any, 'createDocRef').and.returnValue({});
      spyOn(service as any, 'getDocument').and.returnValue(
        Promise.resolve({ exists: () => true, data: () => mockUserDoc }),
      );

      await service.login('admin@test.com', 'password123');
      const user = service.getCurrentUser();
      expect(user).toEqual(
        jasmine.objectContaining({
          uid: 'uid-1',
          email: 'admin@test.com',
          role: 'admin',
        }),
      );
    });
  });
});
