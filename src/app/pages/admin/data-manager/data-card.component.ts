import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-data-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './data-card.component.html',
})
export class DataCardComponent {
  readonly iconColor = input<'blue' | 'green' | 'purple' | 'amber'>('blue');
  readonly iconPath = input<string>('');
  readonly title = input<string>('');
  readonly description = input<string>('');
}
