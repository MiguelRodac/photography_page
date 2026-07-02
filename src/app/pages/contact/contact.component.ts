import { Component, inject, signal, OnInit, computed, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsComponent } from "../../shared/components/forms/forms.component";
import { GlobalResourceService } from '../../services/global-resource.service';
import { PublicContentCacheService } from '../../services/public-content-cache.service';
import { EmailService } from '../../services/email.service';
import { take } from 'rxjs';
import { IFormGroup } from '../../interfaces/inputs';

interface ContactInfoItem {
  label: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-contact',
  imports: [NgClass, FormsComponent],
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {
  @ViewChild(FormsComponent) formsComponent?: FormsComponent;

  private readonly resource = inject(GlobalResourceService);
  private readonly contentCache = inject(PublicContentCacheService);
  private readonly emailService = inject(EmailService);

  whatsappLink = this.resource.getWhatsAppLink();
  readonly showServiceError = signal(false);
  readonly selectedService = signal('');

  readonly formSending = signal(false);
  readonly formSuccess = signal(false);
  readonly formError = signal('');

  readonly contactHeroLabel = signal('');
  readonly contactHeroTitle = signal('');
  readonly contactHeroTitleAccent = signal('');
  readonly contactHeroSubtitle = signal('');
  readonly contactBgImage = signal('');
  readonly contactFormTitle = signal('');
  readonly formSubtitle = signal('');
  readonly serviceTypeLabel = signal('');
  readonly serviceTypeError = signal('');
  readonly whatsappTitle = signal('');
  readonly whatsappSubtitle = signal('');
  readonly whatsappColorStart = signal('#22c55e');
  readonly whatsappColorEnd = signal('#16a34a');
  readonly statsValue = signal('');
  readonly statsLabel = signal('');

  readonly contactServices = signal<{ value: string; label: string; icon: string }[]>([]);

  readonly contactInfo = computed<ContactInfoItem[]>(() => {
    const email = this.infoEmail();
    const address = this.infoAddress();
    const responseTime = this.infoResponseTime();
    const items: ContactInfoItem[] = [];
    if (email) items.push({ label: this.infoEmailLabel(), value: email, icon: 'mdi:email' });
    if (address) items.push({ label: this.infoLocationLabel(), value: address, icon: 'mdi:map-marker' });
    if (responseTime) items.push({ label: this.infoResponseLabel(), value: responseTime, icon: 'mdi:clock-outline' });
    return items;
  });

  private readonly infoEmail = signal('');
  private readonly infoAddress = signal('');
  private readonly infoResponseTime = signal('');
  readonly infoEmailLabel = signal('');
  readonly infoLocationLabel = signal('');
  readonly infoResponseLabel = signal('');

  readonly formConfig = signal<IFormGroup>({
    formId: 'contactForm',
    submitText: '',
    inputs: [
      { formControl: 'name', type: 'text', label: '', name: 'name', placeholder: '', required: true, hidden: false, validators: [{ type: 'required', message: 'Requerido' }] },
      { formControl: 'email', type: 'email', label: '', name: 'email', placeholder: '', required: true, hidden: false, validators: [{ type: 'required', message: 'Requerido' }, { type: 'email', message: 'Email inválido' }] },
      { formControl: 'phone', type: 'tel', label: '', name: 'phone', placeholder: '', required: false, hidden: true, validators: [] },
      { formControl: 'message', type: 'textarea', label: '', name: 'message', placeholder: '', required: true, hidden: false, validators: [{ type: 'required', message: 'Requerido' }] },
    ],
  });

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
        if (data['email']) this.infoEmail.set(data['email']);
        if (data['address']) this.infoAddress.set(data['address']);
        if (data['infoEmailLabel']) this.infoEmailLabel.set(data['infoEmailLabel']);
        if (data['infoLocationLabel']) this.infoLocationLabel.set(data['infoLocationLabel']);
        if (data['infoResponseLabel']) this.infoResponseLabel.set(data['infoResponseLabel']);
        if (data['infoResponseValue']) this.infoResponseTime.set(data['infoResponseValue']);
        if (data['whatsappTitle']) this.whatsappTitle.set(data['whatsappTitle']);
        if (data['whatsappSubtitle']) this.whatsappSubtitle.set(data['whatsappSubtitle']);
        if (data['whatsappColorStart']) this.whatsappColorStart.set(data['whatsappColorStart']);
        if (data['whatsappColorEnd']) this.whatsappColorEnd.set(data['whatsappColorEnd']);
        if (data['statsValue']) this.statsValue.set(data['statsValue']);
        if (data['statsLabel']) this.statsLabel.set(data['statsLabel']);
        if (data['submitText']) {
          this.formConfig.update(cfg => ({ ...cfg, submitText: data['submitText'] }));
        }
        if (Array.isArray(data['formFields']) && data['formFields'].length > 0) {
          this.formConfig.update(cfg => {
            const updatedInputs = cfg.inputs.map(defaultInput => {
              const firebaseField = data['formFields'].find((f: any) => f.name === defaultInput.formControl);
              if (firebaseField) {
                return {
                  ...defaultInput,
                  label: firebaseField.label || '',
                  placeholder: firebaseField.placeholder || '',
                  required: !!firebaseField.required,
                  hidden: false,
                  validators: Array.isArray(firebaseField.validators)
                    ? firebaseField.validators.map((v: any) => ({
                        type: v.type,
                        value: v.value,
                        message: v.message || '',
                      }))
                    : [],
                };
              }
              return { ...defaultInput, hidden: true, required: false, validators: [] };
            });
            return { ...cfg, inputs: updatedInputs };
          });
        }
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

    this.formSending.set(true);
    this.formError.set('');
    this.formSuccess.set(false);

    const templateData: Record<string, unknown> = {
      name: event.formData['name'],
      email: event.formData['email'],
      phone: event.formData['phone'],
      message: event.formData['message'],
      service_type: this.selectedService(),
    };

    this.emailService
      .sendForm(templateData)
      .then(() => {
        this.formSending.set(false);
        this.formSuccess.set(true);
        this.formsComponent?.reset();
      })
      .catch(() => {
        this.formSending.set(false);
        this.formError.set('Failed to send message. Please try again or contact via WhatsApp.');
        this.formsComponent?.reset();
      });
  }

  retrySubmission() {
    this.formError.set('');
    this.formsComponent?.reset();
  }
}
