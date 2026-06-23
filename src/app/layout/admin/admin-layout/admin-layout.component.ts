import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarAdminComponent } from "../nav-bar-admin/nav-bar-admin.component";

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, NavBarAdminComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

}
