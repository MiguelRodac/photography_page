import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private readonly STORAGE_KEY = 'photography_admin_auth';

  isAuthenticated(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  login(password: string): boolean {
    if (password === 'admin') {
      localStorage.setItem(this.STORAGE_KEY, 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
