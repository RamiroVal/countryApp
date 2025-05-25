import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Country, CountryResponse } from '../interfaces';
import { CountryMapper } from '../mappers/country.mapper';
import { Region } from '../interfaces/region.type';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  httpClient = inject(HttpClient);

  private queryCacheCapital = new Map<string, { timestamp: number, data: Country[] }>();
  private queryCacheName = new Map<string, { timestamp: number, data: Country[] }>();
  private queryCacheRegion = new Map<Region, { timestamp: number, data: Country[] }>();

  byCapital(query: string): Observable<Country[]> {
    const lowerCaseQuery = query.toLowerCase();
    const cached = this.queryCacheCapital.get(lowerCaseQuery);
    const now = Date.now();

    if (cached && (now - cached.timestamp < 1 * 60 * 1000)) return of(cached?.data ?? []).pipe(delay(300));

    return this.httpClient
      .get<CountryResponse[]>(`${environment.api}/capital/${lowerCaseQuery}`)
      .pipe(
        delay(300),
        map(CountryMapper.mapCountryResponseArrayToCountryArray),
        tap((countries) => this.queryCacheCapital.set(lowerCaseQuery, { timestamp: Date.now(), data: countries})),
        catchError((e) => throwError(() => e)),
      );
  }

  byName(query: string): Observable<Country[]> {
    const lowerCaseQuery = query.toLowerCase();
    const cached = this.queryCacheName.get(lowerCaseQuery);
    const now = Date.now();

    if (cached && (now - cached.timestamp < 1 * 60 * 1000)) return of(cached?.data ?? []).pipe(delay(300));

    return this.httpClient
      .get<CountryResponse[]>(`${environment.api}/name/${lowerCaseQuery}`)
      .pipe(
        delay(300),
        map(CountryMapper.mapCountryResponseArrayToCountryArray),
        tap((countries) => this.queryCacheName.set(lowerCaseQuery, { timestamp: Date.now(), data: countries})),
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

  byRegion(region: Region) {
    const cached = this.queryCacheRegion.get(region);
    const now = Date.now();

    if (cached && (now - cached.timestamp < 1 * 60 * 1000)) return of(cached?.data ?? []).pipe(delay(300));

    return this.httpClient
      .get<CountryResponse[]>(`${environment.api}/region/${region}`)
      .pipe(
        delay(300),
        map(CountryMapper.mapCountryResponseArrayToCountryArray),
        tap((countries) => this.queryCacheName.set(region, { timestamp: Date.now(), data: countries})),
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
