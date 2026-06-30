import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarAdminComponent } from "../nav-bar-admin/nav-bar-admin.component";
import { ToastComponent } from "../../../shared/components/toast/toast.component";

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, NavBarAdminComponent, ToastComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

}
