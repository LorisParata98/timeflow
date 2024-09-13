import { Component, input, model, output, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { LayoutService } from '../../../../services/utils/app.layout.service';

@Component({
  standalone: true,
  imports: [DialogModule, ButtonModule],
  selector: 'app-simple-dialog',
  templateUrl: './simple-dialog.component.html',
  styleUrls: ['./simple-dialog.component.scss'],
})
export class SimpleDialogComponent {
  public header = input<string>('');
  public headerStyle = input<string>('text-center');
  public styleClass = model<string | undefined>(undefined);
  public closable = input<boolean>(true);
  public hideCloseButton = input<boolean>(false);
  public size = input<string>('md');
  public icon = input<string>('pi-times');
  public onClose = output<void>();
  public visible = signal<boolean>(false);
  public isMobile = signal<boolean>(false);
  constructor(private _layoutService: LayoutService) {
    this._layoutService.isMobile.subscribe((el) => {
      this.isMobile.set(el);
    });
  }

  public show() {
    this.visible.set(true);
  }

  public close() {
    this.visible.set(false);
    this.onClose.emit();
  }

  public getStyleClass(): string {
    return this.styleClass() ?? '';
  }
  public getSize(): Object {
    let widthValue: string = '';
    let heightValue: string = '';
    let maxWidth = '75vw';
    let height = 'unset';

    switch (this.size()) {
      case 'xs':
        widthValue = this.isMobile() ? '60vw' : '30vw';
        maxWidth = this.isMobile() ? '95vw' : '700px';
        break;
      case 'sm':
        widthValue = this.isMobile() ? '60vw' : '45vw';
        maxWidth = this.isMobile() ? '95vw' : '800px';
        break;
      case 'md':
        widthValue = this.isMobile() ? '60vw' : '50vw';
        break;
      case 'lg':
        widthValue = this.isMobile() ? '80vw' : '60vw';
        break;
      case 'xl':
        widthValue = this.isMobile() ? '90vw' : '700vw';
        maxWidth = '90vw';
        break;
      case 'max':
        widthValue = this.isMobile() ? '95vw' : '80vw';
        maxWidth = '90vw';
        height = '90vw';
        break;
    }

    return {
      width: widthValue,
      height: height,
      heightValue,
      'max-width': maxWidth,
    };
  }
}
