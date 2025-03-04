export interface IValidator {
  type: string;
  value?: any;
  message: string;
}

export interface Iinputs {
  formControl: string;
  label: string;
  name: string;
  type: string;
  vale?: string;
  placeholder?: string;
  minlength?: number;
  maxlength?: number;
  required?: boolean;
  class?: string;
  validators?: IValidator[];
}

export interface IFormGruop {
  formId: string;
  submitText: string;
  intpus: Iinputs[];
}
