import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'product-list',
    pathMatch: 'full',
  },
  {
    path: 'personal-info',
    title: 'Personal Info',
    loadComponent: () => import('./pages/personal-info/personal-info').then((m) => m.PersonalInfo),
  },
  {
    path: 'product-list',
    title: 'Product List',
    loadComponent: () => import('./pages/products-list/products-list').then((m) => m.ProductsList),
  },
];
