import { ChangeDetectionStrategy, Component, effect, HostListener, inject, linkedSignal, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountrySearchInputComponent } from '../../components/country-search-input/country-search-input.component';
import { CountryService } from '../../services/country.service';
import { GlobalAlertService } from '../../../shared/components/global-alert/services/globa-alert.service';

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
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);


  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';
  query = linkedSignal<string>(() => this.queryParam);

  ngOnInit(): void {
    if (!this.queryParam) this.countryResource.set(this.countryService.load(SEARCH_TERM));
  }

  ngOnDestroy(): void {
    const countries = this.countryResource.value();
    if (countries) this.countryService.save(SEARCH_TERM, countries);
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: BeforeUnloadEvent) {
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
      return this.countryService.byCapital(request.query);
    }
  });

  readonly messageError = effect(() => {
    if (this.countryResource.error()) {
      this.alert.show('No se encontró el país', 'warning');
    }
  });
}
