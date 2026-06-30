import { Component, inject } from '@angular/core';
import { ToastService, Toast } from '../../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border cursor-pointer
                 toast-slide-in min-w-[280px] max-w-[400px]"
          [class]="toast.type === 'success'
            ? 'bg-green-900/90 border-green-700/50 text-green-100'
            : 'bg-red-900/90 border-red-700/50 text-red-100'"
          (click)="toastService.remove(toast.id)"
        >
          @if (toast.type === 'success') {
            <svg class="w-5 h-5 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          } @else {
            <svg class="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          }
          <span class="text-sm font-medium">{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes toastSlideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    :host { display: contents; }
    .toast-slide-in { animation: toastSlideIn 0.3s ease-out; }
  `],
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}
