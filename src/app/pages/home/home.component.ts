import { Component } from '@angular/core';
import { ICards } from '../../interfaces/cards-img';
import { CardImgComponent } from "../../shared/card-img/card-img.component";
import { TextDescriptionComponent } from "../../shared/text-description/text-description.component";
import { IText } from '../../interfaces/text-content';

@Component({
  selector: 'app-home',
  imports: [CardImgComponent, TextDescriptionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  public cardsImg: ICards[] = [
    {
      img: 'https://secrecyjewels.es/blog/wp-content/uploads/2022/10/esencia-de-una-persona.jpg',
    },
    {
      img: 'https://tecnologia-informatica.com/wp-content/uploads/2019/06/word-image-91.jpeg',
    },
    {
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeLehRP7F6CtBtkyK9fGy6CGA8TPVwhjw3ZQ&s',
    },
  ];

  public textContent: IText[] = [
    {
      title: '¡HOLA!',
      titleSecond: 'SOY ACAS PHOTOGRAPHY',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in mi vel ipsum dapibus molestie. Duis auctor, mauris vel lobortis dignissim, velit purus ultricies velit, et consectetur neque velit nec velit. Donec in mi vel ipsum dapibus molestie. Lorem ipsum dolor sit amet, consectetur adip iscing elit. Donec in mi vel ipsum dapibus molestie. Lorem ipsum dolor sit amet, con sect et justo vel met null'
    },
    {
      title: 'MOMENTOS',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in mi vel ipsum dapibus molestie. Duis auctor, mauris vel lobortis dignissim, velit purus ultricies velit, et consectetur neque velit nec velit. Donec in mi vel ipsum dapibus molestie. Lorem ipsum dolor sit amet, consectetur adip iscing elit. Donec in mi vel ipsum dapibus molestie. Lorem ipsum dolor sit amet, con sect et justo vel met null'
    },
    {
      title: 'CREACIÓN DE CONTENIDO',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in mi vel ipsum dapibus molestie. Duis auctor, mauris vel lobortis dignissim, velit purus ultricies velit, et consectetur neque velit nec velit. Donec in mi vel ipsum dapibus molestie. Lorem ipsum dolor sit amet, consectetur adip iscing elit. Donec in mi vel ipsum dapibus molestie. Lorem ipsum dolor sit amet, con sect et justo vel met null'
    },
  ]

  constructor() {}



}
