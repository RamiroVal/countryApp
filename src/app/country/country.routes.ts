import { Routes } from '@angular/router';
import { CountryLayoutComponent } from './layouts/CountryLayout/country-layout.component';
import ByCapitalPageComponent from './pages/by-capital-page/by-capital-page.component';

export const countryRoutes: Routes = [
  {
    path: '',
    component: CountryLayoutComponent,
    children: [
      {
        path: 'by-capital',
        component: ByCapitalPageComponent,
        data: { animation: 'ByCapital' },
      },
      {
        path: 'by-country',
        loadComponent: () => import('./pages/by-country/by-country.component'),
        data: { animation: 'ByCountry' },
      },
      {
        path: 'by-region',
        loadComponent: () => import('./pages/by-region/by-region.component'),
        data: { animation: 'ByRegion' },
      },
      {
        path: 'by/:code',
        loadComponent: () => import('./pages/country-page/country-page.component'),
        data: { animation: 'CountryDetail' },
      },
      {
        path: '**',
        redirectTo: 'by-capital',
      },
    ],
  },
];

export default countryRoutes;
