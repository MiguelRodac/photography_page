import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { ThemeToggleComponent } from "../../shared/theme-toggle/theme-toggle.component";
import { GlobalResourceService } from '../../services/global-resource.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, NavBarComponent, ThemeToggleComponent],
  templateUrl: './header.component.html' })
export class HeaderComponent {
  private readonly resource = inject(GlobalResourceService);

  get title() {
    return this.resource.getSiteName();
  }

  get logo() {
    return this.resource.getLogo();
  }
}
