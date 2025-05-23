import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SvgIconComponent } from '@ngneat/svg-icon';

interface MenuItem {
  title: string;
  icon: string;
  url: string;
}

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  imports: [
    RouterLink,
    RouterLinkActive,
    SvgIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent {
  public menuOptions: MenuItem[] = [
    { title: 'Por capital', icon: 'airplane', url: '/country/by-capital' },
    { title: 'Por país', icon: 'map', url: '/country/by-country' },
    { title: 'Por región', icon: 'location', url: '/country/by-region' },
  ];

  closeDrawer() {
    const drawerCheckbox = document.getElementById('my-drawer') as HTMLInputElement;
    if (drawerCheckbox) {
      drawerCheckbox.checked = false;
    }
  }
}
