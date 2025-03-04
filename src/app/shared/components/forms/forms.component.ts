import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { InputsComponent } from '../inputs/inputs.component';
import { IForms } from '../../../interfaces/forms';
import { IFormGruop, IValidator } from '../../../interfaces/inputs';

@Component({
  selector: 'app-forms',
  imports: [ReactiveFormsModule, InputsComponent],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent {

  @Input() formInput!: IFormGruop;
  @Output() formOutput: EventEmitter<IForms> = new EventEmitter();

  public dynamicForm!: FormGroup;

  ngOnInit() {
    this.createForm();
  }

  // Crea el FormGroup y los FormControls
  private createForm() {
    const formControls: { [key: string]: FormControl } = {};

    this.formInput.intpus.forEach(input => {
      formControls[input.formControl] = new FormControl(
        '',
        this.getValidators(input.validators || [])
      );
    });

    this.dynamicForm = new FormGroup(formControls);
  }

  // Mapea validadores dinámicos
  private getValidators(validators: IValidator[]): ValidatorFn[] {
    return validators.map(validator => {
      switch (validator.type) {
        case 'required': return Validators.required;
        case 'minLength': return Validators.minLength(validator.value);
        case 'maxLength': return Validators.maxLength(validator.value);
        case 'pattern': return Validators.pattern(validator.value);
        case 'email': return Validators.email;
        default: return Validators.nullValidator;
      }
    });
  }

  onSubmit() {
    if (this.dynamicForm.valid) {
      this.formOutput.emit({
        formId: this.formInput.formId,
        formData: this.dynamicForm.value
      });
    }
  }

}
