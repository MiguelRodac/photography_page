import { Component } from '@angular/core';
import { CardImgComponent } from "../../shared/card-img/card-img.component";
import { ICards } from '../../interfaces/cards-img';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFormGruop } from '../../interfaces/inputs';
import { FormsComponent } from "../../shared/components/forms/forms.component";

@Component({
  selector: 'app-contact',
  imports: [CardImgComponent, FormsComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  public imgContat: ICards[] = [
    {
      img: 'https://borgenproject.org/wp-content/uploads/The-Borgen-Project-Contact-Us-2.png',
    }
  ];

  public form: IFormGruop;

  constructor()
  {
    this.form = {
      formId: 'contactForm',
      submitText: 'Enviar',
      intpus: [
        {
          formControl: 'name',
          type: 'text',
          label: 'Nombre',
          name: 'name',
          required: true,
          validators: [
            { type: 'required', message: 'El nombre es obligatorio' },
            { type: 'minLength', value: 3, message: 'Mínimo 3 caracteres' },
            { type: 'maxLength', value: 30, message: 'Máximo 30 caracteres' },
            {
              type: 'pattern',
              value: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$',
              message: 'Solo letras y espacios'
            }
          ],
        },
        {
          formControl: 'phone',
          type: 'tel',
          label: 'Teléfono',
          name: 'phone',
          required: true,
          validators: [
            { type: 'required', message: 'El teléfono es obligatorio' },
            { type: 'pattern', value: '^[0-9]+$', message: 'Solo números permitidos' },
            { type: 'minLength', value: 10, message: 'Mínimo 10 dígitos' },
            { type: 'maxLength', value: 15, message: 'Máximo 15 dígitos' },
          ],

        },
        {
          formControl: 'email',
          type: 'email',
          label: 'Email',
          name: 'email',
          required: true,
          validators: [
            { type: 'required', message: 'El email es obligatorio' },
            { type: 'email', message: 'Formato de email inválido' },
            {
              type: 'pattern',
              value: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
              message: 'Ejemplo: usuario@dominio.com'
            }
          ],
        },
        {
          formControl: 'company',
          type: 'text',
          label: 'Empresa',
          name: 'company',
          required: true,
          validators: [
            { type: 'required', message: 'La empresa es obligatoria' },
            { type: 'minLength', value: 2, message: 'Mínimo 2 caracteres' },
            { type: 'maxLength', value: 50, message: 'Máximo 50 caracteres' },
          ]
        },
        {
          formControl: 'message',
          type: 'text-are',
          label: 'Mensaje',
          name: 'identificadorPersona',
          required: true,
          validators: [
            { type: 'required', message: 'Identificador obligatorio' },
            { type: 'minLength', value: 10, message: 'Mínimo 5 caracteres' },
            { type: 'maxLength', value: 50, message: 'Máximo 10 caracteres' },
            {
              type: 'pattern',
              value: '^[A-Za-z0-9-]+$',
              message: 'Solo letras, números y guiones'
            }
          ],
        }
      ]
    }
  }

}
