import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { ThemeToggleComponent } from "../../shared/theme-toggle/theme-toggle.component";
import { GlobalResourceService } from '../../services/global-resource.service';
import { PublicContentCacheService } from '../../services/public-content-cache.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, NavBarComponent, ThemeToggleComponent],
  templateUrl: './header.component.html' })
export class HeaderComponent implements OnInit {
  private readonly resource = inject(GlobalResourceService);
  private readonly contentCache = inject(PublicContentCacheService);

  readonly siteName = signal('');
  readonly logoUrl = signal('');

  ngOnInit(): void {
    this.contentCache.getSection<Record<string, unknown>>('header').pipe(take(1)).subscribe(data => {
      if (data?.['siteName']) this.siteName.set(data['siteName'] as string);
      if (data?.['logoUrl']) this.logoUrl.set(data['logoUrl'] as string);
    });
  }

  get title() {
    return this.siteName();
  }
}
