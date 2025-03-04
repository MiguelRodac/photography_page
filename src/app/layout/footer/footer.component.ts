import { Component } from '@angular/core';
import { GlobalResourseService } from '../../services/global-resourse.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor(
    private resourse: GlobalResourseService
  ) { }

  get title() {
    return this.resourse.getTitle();
  }

  get logo() {
    return this.resourse.getLogo();
  }

  get footerText() {
    return this.resourse.getFooterText();
  }

  public getSocialMediaLinks(social: string): string {
    return this.resourse.getSocialMediaLinks(social);
  }

}
