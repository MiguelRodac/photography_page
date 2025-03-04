import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICards } from '../../interfaces/cards-img';

@Component({
  selector: 'app-card-img',
  imports: [],
  templateUrl: './card-img.component.html',
  styleUrl: './card-img.component.scss'
})
export class CardImgComponent {

  @Input() cardsImg: ICards[] = [];
  @Input() position: number = 0;
  @Output() action: EventEmitter<string> = new EventEmitter();

  onAction(link: string): void {
    if (link != '') {
      this.action.emit(link);
    }
  }

}
