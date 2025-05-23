import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, delay, map, Observable, throwError } from 'rxjs';
import type { Country, CountryResponse } from '../interfaces';
import { CountryMapper } from '../mappers/country.mapper';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  httpClient = inject(HttpClient);

  byCapital(query: string): Observable<Country[]> {
    const lowerCaseQuery = query.toLowerCase();
    return this.httpClient
      .get<CountryResponse[]>(`${environment.api}/capital/${lowerCaseQuery}`)
      .pipe(
        delay(300),
        map(CountryMapper.mapCountryResponseArrayToCountryArray),
        catchError((e) => throwError(() => e)),
      );
  }

  byName(query: string): Observable<Country[]> {
    const lowerCaseQuery = query.toLowerCase();
    return this.httpClient
      .get<CountryResponse[]>(`${environment.api}/name/${lowerCaseQuery}`)
      .pipe(
        delay(300),
        map(CountryMapper.mapCountryResponseArrayToCountryArray),
        catchError((e) => throwError(() => e)),
      );
  }

  byAlphaCode(code: string) {
    return this.httpClient
      .get<CountryResponse[]>(`${environment.api}/alpha/${code}`)
      .pipe(
        delay(300),
        map(CountryMapper.mapCountryResponseArrayToCountryArray),
        map((countries) => countries.at(0)),
        catchError((e) => throwError(() => e)),
      );
  }

  load(key: string): Country[] {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return [];

      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) return [];

      const validCountries = parsed.filter(this.isCountry);

      return (validCountries.length === parsed.length) ? validCountries : [];
    } catch {
      return [];
    }
  }

  save(key: string, countries: Country[]): void {
    sessionStorage.setItem(key, JSON.stringify(countries));
  }

  private isCountry(obj: any): obj is Country {
    return obj &&
      typeof obj === 'object' &&
      typeof obj.cca2 === 'string' &&
      typeof obj.flag === 'string' &&
      typeof obj.flagSvg === 'string' &&
      typeof obj.name === 'string' &&
      (!obj.capital || (Array.isArray(obj.capital) && obj.capital.every((c: any) => typeof c === 'string'))) &&
      typeof obj.population === 'number';
  }
}
