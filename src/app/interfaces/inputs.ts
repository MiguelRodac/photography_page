export interface IValidator {
  type: string;
  value?: string | number | RegExp;
  message: string;
}

export interface IInput {
  formControl: string;
  label: string;
  name: string;
  type: string;
  value?: string;
  placeholder?: string;
  minlength?: number;
  maxlength?: number;
  required?: boolean;
  class?: string;
  validators?: IValidator[];
}

export interface IFormGroup {
  formId: string;
  submitText: string;
  inputs: IInput[];
}
