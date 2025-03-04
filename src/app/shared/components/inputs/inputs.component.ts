import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Iinputs } from '../../../interfaces/inputs';

@Component({
  selector: 'app-inputs',
  imports: [ReactiveFormsModule],
  templateUrl: './inputs.component.html',
  styleUrl: './inputs.component.scss'
})
export class InputsComponent {

  @Input() formGroup!: FormGroup;
  @Input() inputForm: Iinputs[] = [];

  showErrors(controlName: string): boolean {
    const control = this.formGroup.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.formGroup.get(controlName);
    return control ? control.hasError(errorType) : false;
  }

}
