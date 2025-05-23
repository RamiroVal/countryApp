import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from "./shared/components/footer/footer.component";
import { GlobalAlertComponent } from './shared/components/global-alert/global-alert.component';
import { SideMenuComponent } from "./shared/components/side-menu/side-menu.component";
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, GlobalAlertComponent, SideMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly router = inject(Router);

  // Signal que actualiza la URL actual
  private currentUrl = signal(this.router.url);

  // Efecto que actualiza el signal cada vez que cambia la ruta
  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const nav = event as NavigationEnd;
        this.currentUrl.set(nav.urlAfterRedirects);
      });
  }

  readonly showFooter = () => !this.currentUrl().includes('/not-found');
}
