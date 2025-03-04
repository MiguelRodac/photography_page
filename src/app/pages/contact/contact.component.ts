import { Component } from '@angular/core';
import { CardImgComponent } from "../../shared/card-img/card-img.component";
import { ICards } from '../../interfaces/cards-img';

@Component({
  selector: 'app-contact',
  imports: [CardImgComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  public imgContat: ICards[] = [
    {
      img: 'https://borgenproject.org/wp-content/uploads/The-Borgen-Project-Contact-Us-2.png',
    },
    // {
    //   link: 'https://www.google.com/maps/place/Plaza+Serrano/@-34.5879272,-58.4406876,14.52z/data=!4m6!3m5!1s0x95bcb588f4af5d17:0x560fe6ff3f099abf!8m2!3d-34.5887764!4d-58.4302089!16s%2Fg%2F1tk6rhkg?hl=es&entry=ttu&g_ep=EgoyMDI1MDIyNi4xIKXMDSoASAFQAw%3D%3D',
    //   img: 'https://todocodigo.net/img/626.jpg',
    //   title: '¿Cómo llegar?',
    //   description: 'Plaza Serrano, Buenos Aires, Argentina',
    // }
  ];


  // public clickHandler(option: string, event: string): void {

  //   console.log('Option:', option);
  //   console.log('Event:', event);

  //   if (option === 'location') {
  //     window.open(event, '_blank');
  //   }
  // }

}
