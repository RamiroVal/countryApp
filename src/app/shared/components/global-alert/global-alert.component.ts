import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GlobalAlertService } from './services/globa-alert.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'global-alert',
  imports: [NgClass],
  templateUrl: './global-alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalAlertComponent {
  readonly alerts = inject(GlobalAlertService).alerts;
}
