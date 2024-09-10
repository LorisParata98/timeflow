import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarItem } from '../../../models/menu-bar.model';
import { LayoutService } from '../../../services/utils/app.layout.service';
import { OverlayLoaderComponent } from '../../shared/components/overlay-loader/overlay-loader.component';
import { AppTopBarComponent } from '../topbar/app-top-bar.component';

@Component({
  standalone: true,
  imports: [RouterOutlet, OverlayLoaderComponent, AppTopBarComponent],

  selector: 'app-default-layout',
  templateUrl: './app-default-layout.component.html',
  styleUrls: ['./app-default-layout.component.scss'],
})
export class AppDefaultLayoutComponent {
  public items = signal<MenubarItem[]>([]);

  constructor(private _layoutService: LayoutService) {
    this.items.set(this._layoutService.getMenuItems());
  }
}
