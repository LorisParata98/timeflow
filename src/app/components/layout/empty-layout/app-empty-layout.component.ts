import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OverlayLoaderComponent } from '../../shared/components/overlay-loader/overlay-loader.component';

@Component({
  standalone: true,
  imports: [RouterOutlet, OverlayLoaderComponent],
  selector: 'app-empty-layout',
  templateUrl: './app-empty-layout.component.html',
  styleUrls: ['./app-empty-layout.component.scss'],
})
export class AppEmptyLayoutComponent {
  constructor() {}
}
