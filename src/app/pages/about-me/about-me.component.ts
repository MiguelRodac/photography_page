import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-me',
  imports: [RouterLink],
  template: `
    <main class="page-transition">
      <!-- Hero -->
      <section class="relative py-32 px-6 bg-surface-100 dark:bg-surface-900">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p class="text-primary-500 font-medium mb-4 text-sm tracking-widest uppercase">Sobre mí</p>
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-semibold mb-8">
                Capturando historias<br/>
                <span class="text-primary-500">desde hace 10 años</span>
              </h1>
              <p class="text-surface-500 dark:text-surface-400 text-lg leading-relaxed mb-6">
                Soy fotógrafo profesional especializado en retratos, bodas y fotografía comercial. Mi pasión es encontrar la belleza en los momentos cotidianos y transformarlos en recuerdos que duran para siempre.
              </p>
              <p class="text-surface-500 dark:text-surface-400 text-lg leading-relaxed mb-8">
                Cada sesión es una colaboración. Trabajo codo a codo con mis clientes para entender su visión y crear imágenes que cuenten su historia de manera auténtica y emotiva.
              </p>

              <div class="grid grid-cols-3 gap-8">
                @for (stat of stats; track stat.label) {
                  <div>
                    <p class="text-3xl font-display font-bold text-primary-500">{{ stat.value }}</p>
                    <p class="text-sm text-surface-500 dark:text-surface-400 mt-1">{{ stat.label }}</p>
                  </div>
                }
              </div>
            </div>

            <div class="relative">
              <div class="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80"
                     alt="Fotógrafo en acción"
                     class="w-full h-full object-cover" />
              </div>
              <div class="absolute -bottom-6 -left-6 w-32 h-32 rounded-2xl overflow-hidden shadow-xl border-4 border-surface-50 dark:border-surface-950">
                <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80"
                     alt="Cámara profesional"
                     class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Philosophy -->
      <section class="py-24 px-6">
        <div class="max-w-4xl mx-auto text-center">
          <p class="text-primary-500 font-medium mb-4 text-sm tracking-widest uppercase">Mi filosofía</p>
          <blockquote class="text-3xl md:text-4xl font-display font-semibold italic leading-relaxed mb-8">
            "No solo tomo fotos, creo<br/>
            <span class="text-primary-500">recuerdos visuales</span> que trascienden el tiempo."
          </blockquote>
          <p class="text-surface-500 dark:text-surface-400 text-lg leading-relaxed max-w-2xl mx-auto">
            Creo en la fotografía como una forma de arte que combina técnica, creatividad y emoción. Cada imagen que entrego es el resultado de una cuidadosa planificación, una ejecución precisa y un proceso de edición meticuloso.
          </p>
        </div>
      </section>

      <!-- Services Grid -->
      <section class="py-24 px-6 bg-surface-100 dark:bg-surface-900">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <p class="text-primary-500 font-medium mb-4 text-sm tracking-widest uppercase">Servicios</p>
            <h2 class="text-4xl md:text-5xl font-display font-semibold">Lo que ofrezco</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (service of services; track service.id) {
              <div class="p-8 rounded-2xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:border-primary-500/50 transition-colors duration-300">
                <div class="mb-4">
                  @switch (service.id) {
                    @case ('events') {
                      <svg class="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                      </svg>
                    }
                    @case ('portrait') {
                      <svg class="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    }
                    @case ('commercial') {
                      <svg class="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                      </svg>
                    }
                    @case ('editing') {
                      <svg class="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    }
                  }
                </div>
                <h3 class="text-xl font-display font-semibold mb-3">{{ service.title }}</h3>
                <p class="text-surface-500 dark:text-surface-400 text-sm leading-relaxed">{{ service.description }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-24 px-6">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-4xl md:text-5xl font-display mb-6">Trabajemos juntos</h2>
          <p class="text-surface-500 dark:text-surface-400 text-lg mb-10 max-w-xl mx-auto">
            Estoy siempre abierto a nuevos proyectos y colaboraciones. Cuéntame tu idea.
          </p>
          <a routerLink="/contact"
             class="inline-block px-10 py-4 bg-primary-500 hover:bg-primary-400 text-white rounded-lg text-lg font-medium transition-all duration-300 hover:scale-105">
            Contáctame
          </a>
        </div>
      </section>
    </main>
  `,
})
export class AboutMeComponent {
  stats = [
    { value: '500+', label: 'Sesiones' },
    { value: '150+', label: 'Clientes' },
    { value: '10', label: 'Años exp.' },
  ];

  services = [
    { id: 'events', title: 'Bodas y eventos', description: 'Cobertura completa de tu día especial con un enfoque documental que captura cada emoción genuina.' },
    { id: 'portrait', title: 'Retratos', description: 'Sesiones personalizadas que reflejan tu personalidad, desde retratos profesionales hasta familiares.' },
    { id: 'commercial', title: 'Comercial', description: 'Fotografía de producto, arquitectura y contenido visual para impulsar tu marca o negocio.' },
    { id: 'editing', title: 'Edición profesional', description: 'Procesamiento digital avanzado con atención al color, iluminación y detalle en cada imagen.' },
  ];
}
