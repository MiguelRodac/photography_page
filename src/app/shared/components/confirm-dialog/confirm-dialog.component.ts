import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [NgClass],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  readonly i18n = inject(I18nService);

  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';
  @Input() confirmText = '';
  @Input() cancelText = '';
  @Input() variant: 'danger' | 'success' = 'danger';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  get resolvedConfirmText(): string {
    return this.confirmText || this.i18n.t('COMMON.CONFIRM');
  }

  get resolvedCancelText(): string {
    return this.cancelText || this.i18n.t('COMMON.CANCEL');
  }

  get confirmClasses(): string {
    if (this.variant === 'success') {
      return 'bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/20';
    }
    return 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20';
  }

  get iconClasses(): string {
    if (this.variant === 'success') {
      return 'w-6 h-6 text-amber-400';
    }
    return 'w-6 h-6 text-red-400';
  }

  get iconBgClasses(): string {
    if (this.variant === 'success') {
      return 'bg-amber-500/10 border-amber-500/20';
    }
    return 'bg-red-500/10 border-red-500/20';
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
