import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { RegisteredUser } from '../models/user.model';
import { AuthService } from '../services/api/auth.service';
import { RootRoutes } from '../utils/root-routes';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const authService = inject(AuthService);

  const auth: RegisteredUser | undefined = authService.authData;
  if (!auth) {
    return router.createUrlTree([RootRoutes.LOGIN]);
  } else {
    return true;
  }
};
