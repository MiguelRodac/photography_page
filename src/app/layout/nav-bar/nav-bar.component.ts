import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {

  public classMobile: boolean = true;

  toggleMobileMenu(): void {
    this.classMobile =!this.classMobile;
    console.log('toggle', this.classMobile)
  }


}
