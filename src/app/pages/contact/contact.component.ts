import { Component, inject, signal, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsComponent } from "../../shared/components/forms/forms.component";
import { GlobalResourceService } from '../../services/global-resource.service';
import { PublicContentCacheService } from '../../services/public-content-cache.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-contact',
  imports: [NgClass, FormsComponent],
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {
  private readonly resource = inject(GlobalResourceService);
  private readonly contentCache = inject(PublicContentCacheService);

  whatsappLink = this.resource.getWhatsAppLink();
  readonly showServiceError = signal(false);
  readonly selectedService = signal('');

  readonly contactHeroLabel = signal('');
  readonly contactHeroTitle = signal('');
  readonly contactHeroTitleAccent = signal('');
  readonly contactHeroSubtitle = signal('');
  readonly contactFormTitle = signal('');
  readonly contactServices = signal<{ value: string; label: string }[]>([
    { value: 'wedding', label: 'Boda' },
    { value: 'portrait', label: 'Retrato' },
    { value: 'event', label: 'Evento' },
    { value: 'commercial', label: 'Comercial' },
  ]);

  contactInfo = [
    { label: 'Email', value: 'contacto@photographyacas.com', iconPath: 'M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75' },
    { label: 'Ubicación', value: 'Palermo Soho, Buenos Aires', iconPath: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z' },
    { label: 'Respuesta', value: 'Menos de 24 horas', iconPath: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
  ];

  ngOnInit(): void {
    this.contentCache.getSection<any>('contact').pipe(take(1)).subscribe((data) => {
      if (data) {
        if (data['heroLabel']) this.contactHeroLabel.set(data['heroLabel']);
        if (data['heroTitle']) this.contactHeroTitle.set(data['heroTitle']);
        if (data['heroTitleAccent']) this.contactHeroTitleAccent.set(data['heroTitleAccent']);
        if (data['heroSubtitle']) this.contactHeroSubtitle.set(data['heroSubtitle']);
        if (data['formTitle']) this.contactFormTitle.set(data['formTitle']);
        if (data['serviceTypes']) this.contactServices.set(data['serviceTypes']);
        this.contactInfo = [
          { label: 'Email', value: data.email || '', iconPath: 'M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75' },
          { label: 'Ubicación', value: data.address || '', iconPath: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z' },
          { label: 'Respuesta', value: 'Menos de 24 horas', iconPath: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
        ];
      }
    });

    this.contentCache.getSection<any>('whatsapp').pipe(take(1)).subscribe((data) => {
      if (data?.phoneNumber) {
        const phone = data.phoneNumber.replace(/\D/g, '');
        const msg = data.defaultMessage ? `?text=${encodeURIComponent(data.defaultMessage)}` : '';
        this.whatsappLink = `https://wa.me/${phone}${msg}`;
      }
    });
  }

  form = {
    formId: 'contactForm',
    submitText: 'Enviar consulta',
    inputs: [
      {
        formControl: 'name',
        type: 'text',
        label: 'Nombre completo',
        name: 'name',
        placeholder: 'Ej: María García',
        required: true,
        validators: [
          { type: 'required', message: 'El nombre es obligatorio' },
          { type: 'minLength', value: 3, message: 'Mínimo 3 caracteres' },
          { type: 'pattern', value: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$', message: 'Solo letras y espacios' },
        ],
      },
      {
        formControl: 'email',
        type: 'email',
        label: 'Email',
        name: 'email',
        placeholder: 'tu@email.com',
        required: true,
        validators: [
          { type: 'required', message: 'El email es obligatorio' },
          { type: 'email', message: 'Formato de email inválido' },
        ],
      },
      {
        formControl: 'phone',
        type: 'tel',
        label: 'Teléfono (opcional)',
        name: 'phone',
        placeholder: '+54 11 1234-5678',
        required: false,
        maxlength: 25,
        validators: [
          { type: 'pattern', value: '^\\+?[0-9][0-9\\s\\-]{6,19}$', message: 'Ingresá un número de teléfono válido' },
        ],
      },
      {
        formControl: 'message',
        type: 'textarea',
        label: 'Contame tu idea',
        name: 'message',
        placeholder: 'Describí tu proyecto, fecha estimada, presupuesto... ¡cualquier detalle ayuda!',
        required: true,
        maxlength: 1000,
        validators: [
          { type: 'required', message: 'El mensaje es obligatorio' },
          { type: 'minLength', value: 10, message: 'Mínimo 10 caracteres' },
          { type: 'maxLength', value: 800, message: 'Máximo 800 caracteres' },
        ],
      },
    ],
  };

  onFormSubmit(event: { formId: string; formData: Record<string, unknown> }) {
    if (!this.selectedService()) {
      this.showServiceError.set(true);
      return;
    }
    void { ...event.formData, serviceType: this.selectedService() };
  }
}
