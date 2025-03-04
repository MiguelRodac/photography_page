import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { FooterAdminComponent } from "../footer-admin/footer-admin.component";
import { NavBarAdminComponent } from "../nav-bar-admin/nav-bar-admin.component";

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, HeaderAdminComponent, FooterAdminComponent, NavBarAdminComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

}
