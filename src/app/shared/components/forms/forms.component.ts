import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { InputsComponent } from '../inputs/inputs.component';
import { IFormData } from '../../../interfaces/forms';
import { IFormGroup, IValidator } from '../../../interfaces/inputs';

@Component({
  selector: 'app-forms',
  imports: [ReactiveFormsModule, NgClass, InputsComponent],
  template: `
    <form [formGroup]="dynamicForm" (ngSubmit)="onSubmit()" novalidate class="space-y-10">

      <!-- Input fields in 2-column grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-7">
        @for (input of formInput.inputs; track input.formControl) {
          @if (input.type !== 'textarea') {
            <app-inputs [formGroup]="dynamicForm" [inputForm]="[input]" />
          }
        }
      </div>

      <!-- Textarea full width with extra breathing room -->
      <div class="my-6">
        @for (input of formInput.inputs; track input.formControl) {
          @if (input.type === 'textarea') {
            <app-inputs [formGroup]="dynamicForm" [inputForm]="[input]" />
          }
        }
      </div>

      @if (state === 'idle') {
        <button type="submit"
                [disabled]="dynamicForm.invalid || !canSubmit"
                 class="w-full py-4 rounded-2xl font-medium text-white transition-all duration-300 flex items-center justify-center gap-3 text-base"
                [ngClass]="{
                  'bg-primary-500 hover:bg-primary-400 hover:shadow-xl hover:shadow-primary-500/20 active:scale-[0.98] cursor-pointer': dynamicForm.valid && canSubmit,
                  'bg-surface-200 dark:bg-surface-700 text-surface-400 cursor-not-allowed': dynamicForm.invalid || !canSubmit
                }">
          <span>{{ formInput.submitText || 'Enviar' }}</span>
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
        </button>
      }

      @if (state === 'sending') {
        <div class="flex flex-col items-center gap-4 py-8">
          <div class="relative w-14 h-14">
            <div class="absolute inset-0 border-[3px] border-primary-200 dark:border-primary-900 rounded-full"></div>
            <div class="absolute inset-0 border-[3px] border-transparent border-t-primary-500 rounded-full animate-spin"></div>
          </div>
          <div class="text-center">
            <p class="text-surface-700 dark:text-surface-200 font-medium">Enviando tu mensaje...</p>
            <p class="text-surface-400 text-sm mt-1">Esto tomará solo un momento</p>
          </div>
        </div>
      }

      @if (state === 'success') {
        <div class="text-center py-8 animate-fade-in">
          <div class="w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-5">
            <svg class="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h3 class="text-2xl font-display font-semibold mb-2 text-surface-900 dark:text-white">¡Mensaje enviado!</h3>
          <p class="text-surface-500 dark:text-surface-400 mb-8 max-w-sm mx-auto">
            Gracias por tu interés. Te responderé en menos de 24 horas.
          </p>
          <button type="button"
                  (click)="reset()"
                  class="px-8 py-3 rounded-2xl border-2 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:border-primary-500 hover:text-primary-500 font-medium transition-all duration-300">
            Enviar otro mensaje
          </button>
        </div>
      }
    </form>
  `,
})
export class FormsComponent {
  @Input() formInput!: IFormGroup;
  @Input() canSubmit = true;
  @Output() formOutput: EventEmitter<IFormData> = new EventEmitter();

  dynamicForm!: FormGroup;
  state: 'idle' | 'sending' | 'success' = 'idle';

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    const formControls: { [key: string]: FormControl } = {};
    this.formInput.inputs.forEach(input => {
      formControls[input.formControl] = new FormControl(
        '',
        this.getValidators(input.validators || [])
      );
    });
    this.dynamicForm = new FormGroup(formControls);
  }

  private getValidators(validators: IValidator[]): ValidatorFn[] {
    return validators.map(validator => {
      switch (validator.type) {
        case 'required': return Validators.required;
        case 'minLength': return Validators.minLength(validator.value as number);
        case 'maxLength': return Validators.maxLength(validator.value as number);
        case 'pattern': return Validators.pattern(validator.value as string | RegExp);
        case 'email': return Validators.email;
        default: return Validators.nullValidator;
      }
    });
  }

  onSubmit() {
    if (this.dynamicForm.valid && this.canSubmit) {
      this.state = 'sending';
      this.formOutput.emit({
        formId: this.formInput.formId,
        formData: this.dynamicForm.value,
      });

      setTimeout(() => {
        this.state = 'success';
      }, 1800);
    }
  }

  reset() {
    this.state = 'idle';
    this.dynamicForm.reset();
  }
}