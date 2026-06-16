import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsComponent } from "../../shared/components/forms/forms.component";
import { GlobalResourceService } from '../../services/global-resource.service';

@Component({
  selector: 'app-contact',
  imports: [NgClass, FormsComponent],
  template: `
    <main class="page-transition">
      <!-- Hero with background image - adapts to theme -->
      <section class="relative py-28 md:py-36 px-6 overflow-hidden bg-surface-100 dark:bg-surface-950">
        <!-- Dark overlay only in dark mode -->
        <div class="absolute inset-0 dark:bg-surface-950">
          <div class="absolute inset-0 bg-surface-100/60 dark:hidden z-10"></div>
          <div class="absolute inset-0 bg-gradient-to-br from-surface-950/0 via-surface-950/0 to-surface-950/0 dark:from-surface-950/95 dark:via-surface-950/85 dark:to-surface-950/95 z-10"></div>
          <div class="absolute inset-0 z-0 opacity-30 dark:opacity-100"
               style="background-image: url('https://images.unsplash.com/photo-1473968512527-509dea398408?auto=format&fit=crop&w=1920&q=80'); background-size: cover; background-position: center;">
          </div>
        </div>
        <div class="relative z-20 max-w-4xl mx-auto text-center">
          <p class="text-primary-600 dark:text-primary-500 font-medium mb-4 text-sm tracking-widest uppercase">Contacto</p>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-surface-900 dark:text-white mb-6">
            Hagamos realidad<br/>
            <span class="text-primary-600 dark:text-primary-400">tu proyecto</span>
          </h1>
          <p class="text-surface-500 dark:text-surface-300 text-lg md:text-xl max-w-xl mx-auto">
            Completa el formulario y cuéntame tu idea. Te responderé en menos de 24 horas.
          </p>
        </div>
      </section>

      <!-- Form + Info -->
      <section class="py-20 px-6">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">

            <!-- Form Column -->
            <div class="lg:col-span-7">
              <div class="bg-white dark:bg-surface-900 rounded-3xl p-8 md:p-10 border border-surface-200/80 dark:border-surface-800 shadow-2xl shadow-surface-200/40 dark:shadow-none">
                <div class="flex items-center gap-3 mb-8">
                  <div class="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <svg class="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-display font-semibold">Envíame tu consulta</h2>
                    <p class="text-sm text-surface-400">Campos marcados con <span class="text-red-400">*</span> son obligatorios</p>
                  </div>
                </div>

                <!-- Service Type Selector -->
                <div class="mb-8">
                  <p class="text-sm font-medium text-surface-600 dark:text-surface-300 mb-3">
                    ¿Qué tipo de sesión te interesa? <span class="text-red-400">*</span>
                  </p>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    @for (service of serviceTypes; track service.value) {
                      <button type="button"
                              (click)="selectService(service.value)"
                              class="p-3 rounded-2xl border-2 text-center transition-all duration-300"
                              [ngClass]="{
                                'border-primary-500 bg-primary-500/5 text-primary-600 dark:text-primary-400 shadow-sm shadow-primary-500/10': selectedService === service.value,
                                'border-surface-200 dark:border-surface-700 text-surface-500 dark:text-surface-400 hover:border-primary-500/40': selectedService !== service.value
                              }">
                        <div class="text-xl mb-1">{{ service.icon }}</div>
                        <div class="font-medium text-xs">{{ service.label }}</div>
                      </button>
                    }
                  </div>
                  @if (showServiceError) {
                    <p class="mt-2 text-xs text-red-400 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                      </svg>
                      Seleccioná un tipo de sesión para continuar
                    </p>
                  }
                </div>

                <app-forms [formInput]="form" [canSubmit]="!!selectedService" (formOutput)="onFormSubmit($event)" />
              </div>
            </div>

            <!-- Info Column -->
            <div class="lg:col-span-5 space-y-8">
              <!-- Contact Cards -->
              <div class="space-y-4">
                @for (info of contactInfo; track info.label) {
                  <div class="flex items-center gap-4 p-5 rounded-2xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:border-primary-500/30 transition-colors duration-300">
                    <div class="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="info.iconPath" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-sm text-surface-900 dark:text-white">{{ info.label }}</p>
                      <p class="text-surface-500 dark:text-surface-400 text-sm">{{ info.value }}</p>
                    </div>
                  </div>
                }
              </div>

              <!-- WhatsApp CTA Card -->
              <a [href]="whatsappLink"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="block p-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/25 group">
                <div class="flex items-center gap-4 mb-3">
                  <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold">¿Prefieres WhatsApp?</p>
                    <p class="text-sm text-white/80">Respondo más rápido por aquí</p>
                  </div>
                  <svg class="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </a>

              <!-- Trust Badge -->
              <div class="p-6 rounded-2xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-center">
                <p class="text-3xl font-display font-bold text-primary-500 mb-1">500+</p>
                <p class="text-sm text-surface-500 dark:text-surface-400">clientes satisfechos</p>
                <div class="flex justify-center gap-1 mt-3">
                  @for (s of [1,2,3,4,5]; track s) {
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" />
                    </svg>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `,
})
export class ContactComponent {
  private readonly resource = inject(GlobalResourceService);
  whatsappLink = this.resource.getWhatsAppLink();

  selectedService = '';
  showServiceError = false;

  serviceTypes = [
    { value: 'wedding', label: 'Boda', icon: '💍' },
    { value: 'portrait', label: 'Retrato', icon: '👤' },
    { value: 'event', label: 'Evento', icon: '🎉' },
    { value: 'commercial', label: 'Comercial', icon: '💼' },
  ];

  contactInfo = [
    {
      label: 'Email',
      value: 'contacto@photographyacas.com',
      iconPath: 'M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75',
    },
    {
      label: 'Ubicación',
      value: 'Palermo Soho, Buenos Aires',
      iconPath: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z',
    },
    {
      label: 'Respuesta',
      value: 'Menos de 24 horas',
      iconPath: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    },
  ];

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

  selectService(value: string) {
    this.selectedService = value;
    this.showServiceError = false;
  }

  onFormSubmit(event: { formId: string; formData: Record<string, unknown> }) {
    if (!this.selectedService) {
      this.showServiceError = true;
      return;
    }
    // Simulation: form data captured, no backend to send to
    void { ...event.formData, serviceType: this.selectedService };
  }
}
