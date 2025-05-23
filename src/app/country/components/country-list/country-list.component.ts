import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import type { Country } from '../../interfaces';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'country-list',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './country-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryListComponent {
  loading = input.required<boolean>();

  countries = input.required<Country[]>();
}
