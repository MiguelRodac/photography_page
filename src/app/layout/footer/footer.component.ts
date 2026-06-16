import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlobalResourceService } from '../../services/global-resource.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html' })
export class FooterComponent {

  constructor(
    private resource: GlobalResourceService
  ) { }

  get title() {
    return this.resource.getSiteName();
  }

  get logo() {
    return this.resource.getLogo();
  }

  get footerText() {
    return this.resource.getFooterText();
  }

  public getSocialMediaLinks(social: string): string {
    return this.resource.getSocialMediaLinks(social);
  }

}
