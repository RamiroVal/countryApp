import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CountryService } from '../../services/country.service';
import { ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { CountryInformationComponent } from "./country-information/country-information.component";

@Component({
  selector: 'app-country-page',
  imports: [CountryInformationComponent],
  templateUrl: './country-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CountryPageComponent {
  private readonly countryService = inject(CountryService);

  countryCode = inject(ActivatedRoute).snapshot.params['code'];

  countryResource = rxResource({
    request: () => ({ code: this.countryCode }),
    loader: ({ request }) => {
      return this.countryService.byAlphaCode(request.code);
    }
  })
}
