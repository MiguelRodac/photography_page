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
      img: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg',
    },
    {
      img: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-02.jpg',
    },
    {
      img: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-03.jpg',
    },
  ];

  public textContent: IText[] = [
    {
      title: 'Welcome to Photography_Page',
      titleSecond: 'Discover Our Collection',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in mi vel ipsum dapibus molestie. Duis auctor, mauris vel lobortis dignissim, velit purus ultricies velit, et consectetur neque velit nec velit. Donec in mi vel ipsum dapibus molestie.'
    },
    {
      title: 'About Our Team',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in mi vel ipsum dapibus molestie. Duis auctor, mauris vel lobortis dignissim, velit purus ultricies velit, et consectetur neque velit nec velit. Donec in mi vel ipsum dapibus molestie.'
    },
    {
      title: 'Contact Us',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in mi vel ipsum dapibus molestie. Duis auctor, mauris vel lobortis dignissim, velit purus ultricies velit, et consectetur neque velit nec velit. Donec in mi vel ipsum dapibus molestie.'
    },
  ]

  constructor() {}



}
