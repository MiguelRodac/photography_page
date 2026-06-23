import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, authState, sendPasswordResetEmail as firebaseSendPasswordResetEmail } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, map, tap, shareReplay, switchMap, of, from } from 'rxjs';
import { IAuthService, AuthUser } from '../../core/interfaces/auth-service.interface';
import { UserDoc } from '../../core/interfaces/firestore-models';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService implements IAuthService {
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);
  private _currentUser: AuthUser | null = null;
  private _authState$: Observable<AuthUser | null> | null = null;

  get authState$(): Observable<AuthUser | null> {
    if (!this._authState$) {
      this._authState$ = this.buildAuthState$();
    }
    return this._authState$;
  }

  async login(email: string, password: string): Promise<void> {
    const credential = await this.signIn(email, password);
    const userDoc = await this.fetchUserRole(credential.user.uid);
    this._currentUser = {
      uid: credential.user.uid,
      email: credential.user.email || '',
      displayName: credential.user.displayName || undefined,
      role: userDoc?.role || 'admin',
    };
    // Reset cached auth state so guard gets fresh authenticated user
    this._authState$ = null;
  }

  async logout(): Promise<void> {
    await this.performSignOut();
    this._currentUser = null;
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    await this.sendResetEmail(email);
  }

  hasRole(role: string): boolean {
    if (!this._currentUser) return false;
    if (this._currentUser.role === 'super-admin') return true;
    return this._currentUser.role === role;
  }

  getCurrentUser(): AuthUser | null {
    return this._currentUser;
  }

  // --- Protected wrappers for Firebase calls (testable) ---

  protected buildAuthState$(): Observable<AuthUser | null> {
    return this.observeAuth().pipe(
      switchMap((firebaseUser) => {
        if (!firebaseUser) return of(null);
        return from(this.fetchUserRole(firebaseUser.uid)).pipe(
          map((userDoc): AuthUser => ({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined,
            role: userDoc?.role || 'admin',
          })),
        );
      }),
      tap((user) => (this._currentUser = user)),
      shareReplay(1),
    );
  }

  protected observeAuth(): Observable<any> {
    return authState(this.auth);
  }

  protected signIn(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  protected performSignOut(): Promise<void> {
    return signOut(this.auth);
  }

  protected sendResetEmail(email: string): Promise<void> {
    return firebaseSendPasswordResetEmail(this.auth, email);
  }

  protected createDocRef(path: string): any {
    return doc(this.firestore, path);
  }

  protected async getDocument(ref: any): Promise<any> {
    return getDoc(ref);
  }

  private async fetchUserRole(uid: string): Promise<UserDoc | null> {
    try {
      const userRef = this.createDocRef(`users/${uid}`);
      const snapshot = await this.getDocument(userRef);
      return snapshot.exists() ? (snapshot.data() as UserDoc) : null;
    } catch {
      return null;
    }
  }
}
