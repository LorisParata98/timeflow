import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../api/auth.service';
import { RootRoutes } from '../../utils/root-routes';
import { MenubarItem } from '../../models/menu-bar.model';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  public menuItems: MenubarItem[] = [];
  public isMobile = new BehaviorSubject(false);

  constructor(private _router: Router, private _authService: AuthService) {
    this.menuItems = [
      {
        label: 'menu.login',
        icon: 'login',
        id: 'login',
        disabled: true,
        command: () => {
          this._router.navigate([RootRoutes.LOGIN]);
        },
        visible: !this._authService.authData,
      },

      {
        label: 'menu.logout',
        icon: 'logout',
        id: 'logout',
        disabled: false,
        command: () => {
          this._authService.logout();
          this._router.navigate([RootRoutes.LOGIN]);
        },
        visible: !!this._authService.authData,
      },
    ];
  }

  getMenuItems() {
    const userInfo = this._authService.authData?.userInfo;

    return this.menuItems
      .map((item) => {
        const newItem = { ...item };
        if (newItem.id)
          if (newItem.children) {
            newItem.children = newItem.children.filter((child) => {
              if (typeof child.visible === 'function') {
                return child.visible();
              } else {
                return true;
              }
            });
          }
        return newItem; //Restituisce l'elemento corrente con i children filtrati (se presenti).
      })
      .filter((item) => {
        // return item.roles.includes(role!);
      });
  }
}
