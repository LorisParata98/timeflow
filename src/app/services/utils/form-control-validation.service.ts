import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormControlValidationService {
  public getErrorMessage(
    errorKey: string,
    field: string,
    args: { [key: string]: string | number } | null | boolean
  ): string {
    switch (errorKey) {
      case 'required':
        return 'Il campo ' + field + ' è obbligatorio';
      case 'passwordsAreNotEquals':
        return 'Le password non corrispondono';
      case 'passwordInvalidCharacters':
        return 'La password contiene caratteri non validi';
      default:
        return '';
    }
  }
}
