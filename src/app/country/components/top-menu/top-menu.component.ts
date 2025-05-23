import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeIconComponent } from "../../../shared/components/button-icon/theme-icon.component";

@Component({
  selector: 'country-top-menu',
  imports: [RouterLink, ThemeIconComponent],
  templateUrl: './top-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopMenuComponent { }
