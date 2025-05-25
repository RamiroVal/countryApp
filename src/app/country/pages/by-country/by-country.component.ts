import { ChangeDetectionStrategy, Component, effect, inject, linkedSignal, OnDestroy, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { CountrySearchInputComponent } from '../../components/country-search-input/country-search-input.component';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';
import { GlobalAlertService } from '../../../shared/components/global-alert/services/globa-alert.service';
import { ActivatedRoute, Router } from '@angular/router';

const SEARCH_TERM = 'countries-by-country';

@Component({
  selector: 'app-by-country',
  imports: [CountrySearchInputComponent, CountryListComponent],
  templateUrl: './by-country.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ByCountryComponent implements OnInit {
  private readonly countryService = inject(CountryService);
  private readonly alert = inject(GlobalAlertService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);


  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';
  query = linkedSignal<string>(() => this.queryParam);

  ngOnInit(): void {
    if (!this.queryParam) this.countryResource.set(this.countryService.load(SEARCH_TERM));
  }

  readonly loadSessionStorage = effect(() => {
    const countries = this.countryResource.value();
    if (countries) this.countryService.save(SEARCH_TERM, countries);
  });

  readonly urlParams = effect(() => {
    const q = this.query();
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: q ? { query: q } : {},
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  });

  readonly countryResource = rxResource({
    request: () => ({ query: this.query() }),
    loader: ({ request }) => {
      if (!request.query) return of([]);
      return this.countryService.byName(request.query);
    },
  });

  errorMessage = effect(() => {
    if (this.countryResource.error()) this.alert.show('No se encontró el país', 'warning');
  });
}

