import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/auth/login-page/login-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppDefaultLayoutComponent } from './components/layout/default-layout/app-default-layout.component';
import { AppEmptyLayoutComponent } from './components/layout/empty-layout/app-empty-layout.component';
import { SupplierDetailComponent } from './components/suppliers/supplier-detail/supplier-detail.component';
import { SupplierListComponent } from './components/suppliers/supplier-list/supplier-list.component';
import { authGuard } from './guards/auth.guard';
import { RootRoutes } from './utils/root-routes';

export const routes: Routes = [
  {
    path: RootRoutes.LOGIN,
    component: AppEmptyLayoutComponent,
    children: [
      {
        path: '',
        component: LoginPageComponent,
      },
    ],
  },
  {
    canActivate: [authGuard],
    path: RootRoutes.DASHBOARD,
    component: AppDefaultLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
    ],
  },
  {
    canActivate: [authGuard],
    path: RootRoutes.SUPPLIERS,
    component: AppDefaultLayoutComponent,
    children: [
      { path: '', component: SupplierListComponent },
      { path: ':id', component: SupplierDetailComponent },
    ],
  },
  {
    path: '**',
    redirectTo: RootRoutes.LOGIN,
  },
];
