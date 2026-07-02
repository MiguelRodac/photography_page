import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { IInput } from '../../../interfaces/inputs';

@Component({
  selector: 'app-inputs',
  imports: [ReactiveFormsModule, NgClass],
  template: `
    @for (input of inputForm; track input.formControl) {
      <div [hidden]="input.hidden">
      <div [formGroup]="formGroup" class="w-full space-y-1.5" [class.md-col-span-2]="input.type === 'textarea'">
        <label
          [for]="input.name"
          class="block text-sm font-medium"
          [ngClass]="{
            'text-red-400': showErrors(input.formControl),
            'text-surface-700 dark:text-surface-300': !showErrors(input.formControl)
          }"
        >
          {{ input.label }}
          @if (input.required) {
            <span class="text-red-400 ml-0.5">*</span>
          }
        </label>

        @if (input.type === 'textarea') {
          <textarea
            [formControlName]="input.formControl"
            [name]="input.name"
            [id]="input.name"
            [placeholder]="input.placeholder || ''"
            [required]="input.required || false"
            [attr.maxlength]="input.maxlength || null"
            rows="5"
            class="w-full px-4 py-3 text-sm bg-surface-100 dark:bg-surface-800 border rounded-xl outline-none transition-all duration-200 resize-none"
            [ngClass]="{
              'border-red-300 dark:border-red-400 focus:ring-1 focus:ring-red-400 focus:border-red-400': showErrors(input.formControl),
              'border-surface-200 dark:border-surface-700 focus:ring-1 focus:ring-primary-500 focus:border-primary-500': !showErrors(input.formControl)
            }"
          ></textarea>
        } @else if (input.type === 'tel') {
          <input
            [formControlName]="input.formControl"
            type="tel"
            [name]="input.name"
            [id]="input.name"
            [placeholder]="input.placeholder || ''"
            [required]="input.required || false"
            [attr.maxlength]="input.maxlength || null"
            (input)="formatPhone($event, input.formControl)"
            class="w-full px-4 py-3 text-sm bg-surface-100 dark:bg-surface-800 border rounded-xl outline-none transition-all duration-200"
            [ngClass]="{
              'border-red-300 dark:border-red-400 focus:ring-1 focus:ring-red-400 focus:border-red-400': showErrors(input.formControl),
              'border-surface-200 dark:border-surface-700 focus:ring-1 focus:ring-primary-500 focus:border-primary-500': !showErrors(input.formControl)
            }"
          />
        } @else {
          <input
            [formControlName]="input.formControl"
            [type]="input.type"
            [name]="input.name"
            [id]="input.name"
            [placeholder]="input.placeholder || ''"
            [required]="input.required || false"
            class="w-full px-4 py-3 text-sm bg-surface-100 dark:bg-surface-800 border rounded-xl outline-none transition-all duration-200"
            [ngClass]="{
              'border-red-300 dark:border-red-400 focus:ring-1 focus:ring-red-400 focus:border-red-400': showErrors(input.formControl),
              'border-surface-200 dark:border-surface-700 focus:ring-1 focus:ring-primary-500 focus:border-primary-500': !showErrors(input.formControl)
            }"
          />
        }

        @if (showErrors(input.formControl)) {
          <div class="flex items-center gap-1.5">
            @for (validator of input.validators; track validator.type) {
              @if (hasError(input.formControl, validator.type)) {
                <p class="text-xs text-red-400 flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                  </svg>
                  {{ validator.message }}
                </p>
              }
            }
          </div>
        }
      </div>
      </div>
    }
  `,
})
export class InputsComponent {
  @Input() formGroup!: FormGroup;
  @Input() inputForm: IInput[] = [];

  formatPhone(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Strip anything that's not +, digit, space, or hyphen
    value = value.replace(/[^+\d\s-]/g, '');

    // Auto-prepend + if there's content without it
    if (value && !value.startsWith('+')) {
      value = '+' + value;
    }

    // Remove duplicate + signs (keep only the leading one)
    if (value.startsWith('+')) {
      value = '+' + value.substring(1).replace(/\+/g, '');
    }

    if (value !== input.value) {
      input.value = value;
      this.formGroup.get(controlName)?.setValue(value, { emitEvent: true });
    }
  }

  showErrors(controlName: string): boolean {
    const control = this.formGroup.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.formGroup.get(controlName);
    if (!control) return false;
    if (errorType === 'minLength') return control.hasError('minlength');
    if (errorType === 'maxLength') return control.hasError('maxlength');
    return control.hasError(errorType);
  }
}