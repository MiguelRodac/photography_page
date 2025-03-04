import { Component } from '@angular/core';
import { CardImgComponent } from "../../shared/card-img/card-img.component";
import { TextDescriptionComponent } from "../../shared/text-description/text-description.component";
import { ICards } from '../../interfaces/cards-img';
import { IText } from '../../interfaces/text-content';

@Component({
  selector: 'app-about-me',
  imports: [CardImgComponent, TextDescriptionComponent],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.scss'
})
export class AboutMeComponent {

  public img: ICards[] = [
    {
      img: 'https://www.clarin.com/img/2023/12/28/k8gOUmfp5_720x0__1.jpg',
    }
  ];

  public textContent: IText[] = [
    {
    title: '¿QUIÉN SOY?',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel metus non velit tincidunt semper. Donec vel mauris ac neque convallis lobortis. Donec vel mauris ac neque convallis lobortis. Donec vel mauris ac neque convallis lobortis. Lorem ipsum dolor sit amet, consectetur adip. Lorem et sapien just sed diam non proident sed diam. Lorem ipsum dolor sit amet non proident sed diam non pro.'
    },
    {
      title: 'MIS MEJORES CLEINTES',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel metus non velit tincidunt semper. Donec vel mauris ac neque convallis lobortis. Donec vel mauris ac neque convallis lobortis. Donec vel mauris ac neque convallis lobortis.'
    },
  ]

}
