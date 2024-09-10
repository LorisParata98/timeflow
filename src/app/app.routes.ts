import { Routes } from '@angular/router';
import { AppEmptyLayoutComponent } from './components/layout/empty-layout/app-empty-layout.component';
import { LoginPageComponent } from './components/auth/login-page/login-page.component';

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
];
