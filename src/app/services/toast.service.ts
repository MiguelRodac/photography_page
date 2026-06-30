import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  private nextId = 1;

  success(message: string): void {
    const id = this.nextId++;
    this.toasts.update((t) => [...t, { id, message, type: 'success' }]);
    setTimeout(() => this.remove(id), 3000);
  }

  error(message: string): void {
    const id = this.nextId++;
    this.toasts.update((t) => [...t, { id, message, type: 'error' }]);
    setTimeout(() => this.remove(id), 5000);
  }

  remove(id: number): void {
    this.toasts.update((t) => t.filter((toast) => toast.id !== id));
  }
}
