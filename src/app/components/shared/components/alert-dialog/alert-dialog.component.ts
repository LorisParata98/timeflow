import {
  Component,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { CommonModule } from '@angular/common';

import { SimpleDialogComponent } from '../simple-dialog/simple-dialog.component';

@Component({
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, SimpleDialogComponent],
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss'],
})
export class AlertDialogComponent {
  dialog = viewChild<SimpleDialogComponent>('dialog');

  public showWarning = input<boolean>(true);
  public containerClass = signal<string>('flex justify-content-center');
  public confirm = output<void>();
  public btnClass = signal<string>('p-button');
  public btnText = signal<string>('Ok, va bene');
  public btnTextremove = signal<string>('Elimina');
  public showRemove = input<boolean>(false);
  public showUndoBtn = input<boolean>(false);
  public showConfirmBtn = input<boolean>(true);
  public message = model<string | undefined>('');
  public closable = signal<boolean>(true);
  public showIconWarning = signal<boolean>(true);
  public hideCloseButton = signal<boolean>(false);
  public header = input<string>('Attenzione');

  constructor() {}

  public show(message?: string) {
    if (!!message) {
      this.message.set(message);
    }
    if (this.showRemove()) {
      this.btnClass.set('p-button p-button-danger');
    }

    this.dialog()?.show();
  }

  public close() {
    this.dialog()?.close();
  }

  public onConfirm() {
    this.confirm.emit();
  }
}
