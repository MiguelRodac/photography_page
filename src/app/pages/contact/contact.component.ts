import { Component, inject, signal, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsComponent } from "../../shared/components/forms/forms.component";
import { GlobalResourceService } from '../../services/global-resource.service';
import { PublicContentCacheService } from '../../services/public-content-cache.service';
import { take } from 'rxjs';
import { IFormGroup, IInput } from '../../interfaces/inputs';

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
  readonly contactBgImage = signal('https://images.unsplash.com/photo-1473968512527-509dea398408?auto=format&fit=crop&w=1920&q=80');
  readonly contactFormTitle = signal('');
  readonly formSubtitle = signal('Campos marcados con * son obligatorios');
  readonly serviceTypeLabel = signal('¿Qué tipo de sesión te interesa?');
  readonly serviceTypeError = signal('Seleccioná un tipo de sesión para continuar');
  readonly infoEmailLabel = signal('Email');
  readonly infoLocationLabel = signal('Ubicación');
  readonly infoResponseLabel = signal('Respuesta');
  readonly infoResponseValue = signal('Menos de 24 horas');
  readonly whatsappTitle = signal('¿Prefieres WhatsApp?');
  readonly whatsappSubtitle = signal('Respondo más rápido por aquí');
  readonly statsValue = signal('500+');
  readonly statsLabel = signal('clientes satisfechos');
  readonly contactServices = signal<{ value: string; label: string }[]>([
    { value: 'wedding', label: 'Boda' },
    { value: 'portrait', label: 'Retrato' },
    { value: 'event', label: 'Evento' },
    { value: 'commercial', label: 'Comercial' },
  ]);

  readonly formConfig = signal<IFormGroup>({
    formId: 'contactForm',
    submitText: 'Enviar consulta',
    inputs: [],
  });

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
        if (data['bgImage']) this.contactBgImage.set(data['bgImage']);
        if (data['formTitle']) this.contactFormTitle.set(data['formTitle']);
        if (data['formSubtitle']) this.formSubtitle.set(data['formSubtitle']);
        if (data['serviceTypeLabel']) this.serviceTypeLabel.set(data['serviceTypeLabel']);
        if (data['serviceTypeError']) this.serviceTypeError.set(data['serviceTypeError']);
        if (data['serviceTypes']) this.contactServices.set(data['serviceTypes']);
        if (data['infoEmailLabel']) this.infoEmailLabel.set(data['infoEmailLabel']);
        if (data['infoLocationLabel']) this.infoLocationLabel.set(data['infoLocationLabel']);
        if (data['infoResponseLabel']) this.infoResponseLabel.set(data['infoResponseLabel']);
        if (data['infoResponseValue']) this.infoResponseValue.set(data['infoResponseValue']);
        if (data['whatsappTitle']) this.whatsappTitle.set(data['whatsappTitle']);
        if (data['whatsappSubtitle']) this.whatsappSubtitle.set(data['whatsappSubtitle']);
        if (data['statsValue']) this.statsValue.set(data['statsValue']);
        if (data['statsLabel']) this.statsLabel.set(data['statsLabel']);
        if (Array.isArray(data['formFields']) && data['formFields'].length > 0) {
          const inputs: IInput[] = data['formFields'].map((f: any) => ({
            formControl: f.name,
            name: f.name,
            type: f.type || 'text',
            label: f.label || '',
            placeholder: f.placeholder || '',
            required: !!f.required,
            validators: Array.isArray(f.validators)
              ? f.validators.map((v: any) => ({
                  type: v.type,
                  value: v.value,
                  message: v.message || '',
                }))
              : [],
          }));
          this.formConfig.set({
            formId: 'contactForm',
            submitText: 'Enviar consulta',
            inputs,
          });
        }
        this.contactInfo = [
          { label: this.infoEmailLabel(), value: data.email || '', iconPath: 'M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75' },
          { label: this.infoLocationLabel(), value: data.address || '', iconPath: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z' },
          { label: this.infoResponseLabel(), value: this.infoResponseValue(), iconPath: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
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

  onFormSubmit(event: { formId: string; formData: Record<string, unknown> }) {
    if (!this.selectedService()) {
      this.showServiceError.set(true);
      return;
    }
    void { ...event.formData, serviceType: this.selectedService() };
  }
}
