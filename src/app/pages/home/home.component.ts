import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlobalResourceService } from '../../services/global-resource.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RevealDirective],
  templateUrl: './home.component.html',
  standalone: true,
})
export class HomeComponent {
  private readonly resource = inject(GlobalResourceService);

  readonly services = this.resource.getServices();
  readonly portfolio = this.resource.getPortfolioItems().slice(0, 3);
  readonly content = this.resource.getSiteContent();

  readonly testimonials = [
    { name: 'María García', role: 'Boda • Mayo 2024', text: 'Increíble trabajo. Capturó cada momento especial de nuestra boda con una sensibilidad única. Las fotos son espectaculares.' },
    { name: 'Carlos Mendoza', role: 'Retrato Corporativo', text: 'Profesionalismo absoluto. Las fotos para nuestro equipo directivo quedaron impecables. Superó todas nuestras expectativas.' },
    { name: 'Ana López', role: 'Sesión Familiar', text: 'Hizo que toda la familia se sintiera cómoda. Las fotos naturales son justo lo que queríamos. ¡Repetiremos sin duda!' },
  ];
}
