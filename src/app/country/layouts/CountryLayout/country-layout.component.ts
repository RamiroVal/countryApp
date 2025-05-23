import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopMenuComponent } from "../../components/top-menu/top-menu.component";
import { routeAnimations } from '../../route-animations';

@Component({
  selector: 'app-country-layout',
  imports: [RouterOutlet, TopMenuComponent],
  templateUrl: './country-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [routeAnimations]
})
export class CountryLayoutComponent {
  isMenuVisible = signal(true);
  private lastScrollY = window.scrollY;

  constructor() {
    effect(() => {
      const onScroll = () => {
        const currentScroll = window.scrollY;
        if (currentScroll > this.lastScrollY && currentScroll > 50) {
          this.isMenuVisible.set(false); // ocultar al bajar
        } else if (currentScroll < this.lastScrollY) {
          this.isMenuVisible.set(true); // mostrar al subir
        }
        this.lastScrollY = currentScroll;
      };

      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    });
  }

  getAnimation(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
}
