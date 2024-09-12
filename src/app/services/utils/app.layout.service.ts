import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { MenubarItem } from '../../models/menu-bar.model';
import { RootRoutes } from '../../utils/root-routes';
import { AuthService } from '../api/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  public menuItems: MenubarItem[] = [];
  public isMobile = new BehaviorSubject(false);

  constructor(private _router: Router, private _authService: AuthService) {
    this.menuItems = [
      {
        label: 'Login',
        icon: 'login',
        id: 'es1',

        command: () => {
          this._router.navigate(['/']);
        },
      },
      {
        label: 'Dashboard',
        icon: 'dashboard',
        id: 'es2',

        command: () => {
          this._router.navigate([RootRoutes.DASHBOARD]);
        },
      },
      {
        label: 'Recensioni',
        icon: 'star',
        id: 'es3',

        command: () => {
          this._router.navigate([RootRoutes.REVIEWS]);
        },
      },

      {
        label: 'Logout',
        icon: 'logout',
        id: 'logout',

        command: () => {
          this._authService.logout();
          this._router.navigate(['/']);
        },
      },
    ];
  }

  getMenuItems() {
    const userInfo = this._authService.authData;
    return this.menuItems.filter((item) => {
      return item;
      // return item.roles.includes(role!);
    });
  }
}
