import { Observable } from 'rxjs';

export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  role: string;
}

export interface IAuthService {
  readonly authState$: Observable<AuthUser | null>;
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  hasRole(role: string): boolean;
  getCurrentUser(): AuthUser | null;
}
