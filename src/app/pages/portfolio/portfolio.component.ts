import { Component } from '@angular/core';
import { ICards } from '../../interfaces/cards-img';
import { CardImgComponent } from "../../shared/card-img/card-img.component";

@Component({
  selector: 'app-portfolio',
  imports: [CardImgComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent {

    public cardsImg: ICards[] = [
      {
        all: true,
        img: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg',
      },
      {
        img: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-02.jpg',
      },
      {
        img: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-03.jpg',
      },
      {
        img: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-04.jpg',
      },
      {
        img: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-05.jpg',
      },
      {
        img: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-06.jpg',
      },
      {
        img: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-07.jpg',
      },
      {
        img: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-08.jpg',
      },
      {
        img: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg',
      },
      {
        img: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-03.jpg',
      },
      {
        img: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-06.jpg',
      },
      {
        img: 'https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-05.jpg',
      },
    ];

}
