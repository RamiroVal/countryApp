import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CountryListComponent } from "../../components/country-list/country-list.component";

@Component({
  selector: 'app-by-region',
  imports: [CountryListComponent],
  templateUrl: './by-region.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ByRegionComponent { }
