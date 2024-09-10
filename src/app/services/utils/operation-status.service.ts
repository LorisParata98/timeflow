import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class OperationStatusHandler {
  constructor(private messagesService: MessageService) {}

  public success(message: string, life?: number) {
    let msg = message;
    let isMobile = window.innerWidth <= 320;

    return this.messagesService.add({
      severity: 'success',
      summary: 'Operazione completata con successo',
      detail: msg,
      life: life || undefined,
      styleClass: isMobile ? 'mobile-dialog' : 'desktop-dialog',
    });
  }

  public error(message?: string) {
    let msg = message;
    return this.messagesService.add({
      severity: 'error',
      summary: 'Attenzione',
      detail: msg,
    });
  }
}
