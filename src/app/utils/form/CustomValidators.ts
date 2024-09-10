import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static passwordInvalidCharacters(
    control: AbstractControl
  ): ValidationErrors | null {
    if (
      CustomValidators._isEmptyInputValue(control.value) ||
      CustomValidators._isEmptyInputValue(length)
    ) {
      return null; // don't validate empty values to allow optional controls
    }

    if (!/^[^àòèìù]+$/i.test(control.value)) {
      return { passwordInvalidCharacters: true };
    }

    return null;
  }

  private static _isEmptyInputValue(value: any): boolean {
    return (
      value == null ||
      ((typeof value === 'string' || Array.isArray(value)) &&
        value.length === 0)
    );
  }

  static match(controlName: string, matchControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const matchControl = controls.get(matchControlName);

      if (!matchControl?.errors && control?.value !== matchControl?.value) {
        matchControl?.setErrors({
          matching: {
            actualValue: matchControl?.value,
            requiredValue: control?.value,
          },
        });
        return { matching: true };
      }
      return null;
    };
  }
}
