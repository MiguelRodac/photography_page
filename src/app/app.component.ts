import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeLoaderService } from './services/theme-loader.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html' })
export class AppComponent implements OnInit {
  private readonly themeLoader = inject(ThemeLoaderService);
  title = 'photography_page';

  ngOnInit(): void {
    this.themeLoader.loadTheme();
  }
}
