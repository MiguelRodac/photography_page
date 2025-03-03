import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { FooterAdminComponent } from "../footer-admin/footer-admin.component";

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, NavBarComponent, HeaderAdminComponent, FooterAdminComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

}
