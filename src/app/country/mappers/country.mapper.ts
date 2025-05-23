import type { Country, CountryResponse } from '../interfaces';

export class CountryMapper {
  static mapCountryResponseToCountry = (country: CountryResponse): Country => ({
    cca2: country.cca2,
    capital: country.capital,
    flagSvg: country.flags.svg,
    name: country.translations['spa'].common ?? 'No Spanish Name',
    population: country.population,
    flag: country.flag,
    region: country.region,
    subregion: country.subregion,
  });

  static mapCountryResponseArrayToCountryArray = (countries: CountryResponse[]) => countries.map(CountryMapper.mapCountryResponseToCountry);
}
