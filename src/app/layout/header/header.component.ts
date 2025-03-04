import { Component } from '@angular/core';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { GlobalResourseService } from '../../services/global-resourse.service';

@Component({
  selector: 'app-header',
  imports: [NavBarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(
    private resourse: GlobalResourseService
  ) { }

  get title() {
    return this.resourse.getTitle();
  }

  get logo() {
    return this.resourse.getLogo();
  }

}
