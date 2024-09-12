import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/auth/login-page/login-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppDefaultLayoutComponent } from './components/layout/default-layout/app-default-layout.component';
import { AppEmptyLayoutComponent } from './components/layout/empty-layout/app-empty-layout.component';
import { RootRoutes } from './utils/root-routes';

export const routes: Routes = [
  {
    path: '',
    component: AppEmptyLayoutComponent,
    children: [
      {
        path: '',
        component: LoginPageComponent,
      },
    ],
  },
  {
    path: '',
    component: AppDefaultLayoutComponent,
    children: [
      {
        path: RootRoutes.DASHBOARD,
        component: DashboardComponent,
      },
    ],
  },
];
