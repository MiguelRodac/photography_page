import { Component, Input } from '@angular/core';
import { IText } from '../../interfaces/text-content';

@Component({
  selector: 'app-text-description',
  imports: [],
  templateUrl: './text-description.component.html',
  styleUrl: './text-description.component.scss'
})
export class TextDescriptionComponent {

  @Input() text: IText = {
    title: '',
    titleSecond: '',
    content: ''
  };

}
