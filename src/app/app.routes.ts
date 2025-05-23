import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'country',
    loadChildren: () => import('./country/country.routes'),
  },
  {
    path: 'not-found',
    loadComponent: () => import('./shared/pages/not-found/not-found.component'),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
