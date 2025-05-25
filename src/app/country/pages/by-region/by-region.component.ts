import { ChangeDetectionStrategy, Component, effect, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { Region } from '../../interfaces/region.type';
import { CountryService } from '../../services/country.service';
import { ActivatedRoute, Router } from '@angular/router';

const SEARCH_TERM = 'countries-by-region';

function validateQueryParam(value: string): Region | null {
  const queryParam = value.toLowerCase();

  const validRegions: Record<string, Region> = {
    'africa': 'Africa',
    'americas': 'Americas',
    'asia': 'Asia',
    'europe': 'Europe',
    'oceania': 'Oceania',
    'antarctic': 'Antarctic',
  }

  return validRegions[queryParam];
}

@Component({
  selector: 'app-by-region',
  imports: [CountryListComponent],
  templateUrl: './by-region.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ByRegionComponent implements OnInit {
  private readonly countryService = inject(CountryService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';
  selectedRegion = linkedSignal<Region | null>(() => validateQueryParam(this.queryParam));

  ngOnInit(): void {
    if (!this.queryParam) this.countryResource.set(this.countryService.load(SEARCH_TERM));
  }

  readonly urlParams = effect(() => {
    const q = this.selectedRegion();
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: q ? { query: q } : {},
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  });

  readonly loadSessionStorage = effect(() => {
    const countries = this.countryResource.value();
    if (countries) this.countryService.save(SEARCH_TERM, countries);
  });

  countryResource = rxResource({
    request: () => ({ region: this.selectedRegion() }),
    loader: ({ request }) => {
      if (!request.region) return of([]);

      return this.countryService.byRegion(request.region);
    }
  });
}
