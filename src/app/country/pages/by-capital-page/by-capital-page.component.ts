import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountrySearchInputComponent } from '../../components/country-search-input/country-search-input.component';
import { CountryService } from '../../services/country.service';
import { GlobalAlertService } from '../../../shared/components/global-alert/services/globa-alert.service';
import { of } from 'rxjs';

const SEARCH_TERM = 'countries-by-capital';

@Component({
  selector: 'app-by-capital-page',
  imports: [CountrySearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ByCapitalPageComponent implements OnInit, OnDestroy {
  private readonly countryService = inject(CountryService);
  private readonly alert = inject(GlobalAlertService);

  query = signal<string>('');

  ngOnInit(): void {
    this.countryResource.set(this.countryService.load(SEARCH_TERM));
  }

  ngOnDestroy(): void {
    const countries = this.countryResource.value();
    if (countries) this.countryService.save(SEARCH_TERM, countries);
  }

  // readonly countryResource = resource({
  //   request: () => ({ query: this.query() }),
  //   loader: async ({ request }) => {
  //     if (!request.query) return [];
  //     return await firstValueFrom(this.countryService.byCapital(request.query));
  //   },
  // });

  readonly countryResource = rxResource({
    request: () => ({ query: this.query() }),
    loader: ({ request }) => {
      if (!request.query) return of([]);
      return this.countryService.byCapital(request.query);
    }
  });

  readonly messageError = effect(() => {
    if (this.countryResource.error()) {
      this.alert.show('No se encontró el país', 'warning');
    }
  });
}
