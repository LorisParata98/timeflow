import { Component, Input, input, signal } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormControlValidationService } from '../../../../../services/utils/form-control-validation.service';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-input-error-label',
  templateUrl: './input-error-label.component.html',
  styleUrls: ['./input-error-label.component.scss'],
})
export class InputErrorLabelComponent {
  public label = input.required<string>();
  @Input() control?: AbstractControl<any, any>;
  @Input() set errors(errors: ValidationErrors | null) {
    this._errors.set(errors);
  }

  private _errors = signal<ValidationErrors | null>(null);

  constructor(
    private _formControlValidationService: FormControlValidationService
  ) {
    this._errors.set(null);
  }

  public get isOnError(): boolean {
    const errors = this.errors;
    return errors != null && Object.keys(errors).length > 0;
  }

  public get errors(): ValidationErrors | null {
    if (this.control) {
      if (this.control.touched) {
        return this.control.errors;
      }
      return null;
    }
    return this._errors();
  }

  public get errorMessage() {
    if (this.isOnError && this.label) {
      const errorKey = Object.keys(this.errors!)[0];

      return this._formControlValidationService.getErrorMessage(
        errorKey,
        this.label(),
        this.errors![errorKey]
      );
    }

    return '';
  }
}
