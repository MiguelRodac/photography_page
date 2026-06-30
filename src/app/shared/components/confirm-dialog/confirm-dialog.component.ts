import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  readonly i18n = inject(I18nService);

  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';
  @Input() confirmText = '';
  @Input() cancelText = '';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  get resolvedConfirmText(): string {
    return this.confirmText || this.i18n.t('COMMON.CONFIRM');
  }

  get resolvedCancelText(): string {
    return this.cancelText || this.i18n.t('COMMON.CANCEL');
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
