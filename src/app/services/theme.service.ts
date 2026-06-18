import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'photography_theme';
  readonly isDark = signal(false);

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const initial = saved ? saved === 'dark' : false;

    this.isDark.set(initial);
    this.applyTheme(initial);

    effect(() => {
      this.applyTheme(this.isDark());
    });
  }

  toggle(): void {
    this.isDark.set(!this.isDark());
  }

  private applyTheme(dark: boolean): void {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem(this.STORAGE_KEY, dark ? 'dark' : 'light');
  }
}
