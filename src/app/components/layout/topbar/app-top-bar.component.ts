import {
  Component,
  DestroyRef,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SidebarModule } from 'primeng/sidebar';
import { SpeedDialModule } from 'primeng/speeddial';
import { ToolbarModule } from 'primeng/toolbar';
import { TreeModule } from 'primeng/tree';
import { StorageService } from '../../../services/utils/storage.service';
import { OperationStatusHandler } from '../../../services/utils/operation-status.service';
import { AuthService } from '../../../services/api/auth.service';
import { LayoutService } from '../../../services/utils/app.layout.service';

export interface CombineMenu {}
@Component({
  standalone: true,
  imports: [
    ToolbarModule,
    ButtonModule,
    CommonModule,
    OverlayPanelModule,
    SidebarModule,
    TreeModule,
    SpeedDialModule,
  ],
  selector: 'app-top-bar',
  styleUrls: ['./app-top-bar.component.scss'],
  templateUrl: './app-top-bar.component.html',
})
export class AppTopBarComponent {
  public userRole = signal<any | undefined>(undefined);
  public showChangeLanguage = signal<boolean>(true);
  public companyName = signal<string | undefined>(undefined);

  public sidebarVisible = signal<boolean>(false);
  public menuItems = signal<any[]>([]);
  public userData = signal<any | undefined>(undefined);
  public items = signal<MenuItem[]>([]);

  public isUserDmg = signal<boolean>(false);
  constructor(
    private _authService: AuthService,
    private _operationStatusHandler: OperationStatusHandler,
    private _storageService: StorageService,
    private _router: Router,
    private _layoutService: LayoutService
  ) {
    this.userData.set(this._authService.authData?.userInfo!);
    this.menuItems.set(this._layoutService.getMenuItems());
  }

  public toggleSideBar() {
    this.sidebarVisible.update((oldValue) => !oldValue);
  }

  public excecuteCommand(data: any) {
    data.command();
  }

  public async redirectTo(data: any, blank: boolean = false) {
    if (data.url && blank) {
      window.open(data.url, '_blank');
    }

    if (data.url && data.tab) {
      await this._router.navigate(
        Array.isArray(data.url) ? data.url : [data.url],
        {
          queryParams: {
            tab: data.tab,
          },
        }
      );
    } else {
      Array.isArray(data.url)
        ? await this._router.navigate(data.url)
        : await this._router.navigateByUrl(data.url);
    }

    if (this.sidebarVisible()) {
      this.toggleSideBar();
    }
  }

  public closeSideBar() {
    this.sidebarVisible.set(false);
  }

  public onLogoutClick() {
    this._authService.logout();
  }
}
