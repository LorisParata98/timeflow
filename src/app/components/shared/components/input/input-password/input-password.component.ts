import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  input,
  Input,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TooltipModule } from 'primeng/tooltip';
import { InputWrapperComponent } from '../input-wrapper/input-wrapper.component';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,

    InputTextModule,
    PasswordModule,
    TooltipModule,
    FormsModule,

    InputWrapperComponent,
  ],
  selector: 'app-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPasswordComponent),
      multi: true,
    },
  ],
})
export class InputPasswordComponent implements ControlValueAccessor {
  @Input() set errors(errors: ValidationErrors | null) {
    this._errors.set(errors);
  }
  @Input() control: AbstractControl<any, any> | undefined;

  public onChange: any = () => {};
  public onTouched: any = () => {};

  private _errors = signal<ValidationErrors | null>(null);
  public value = signal<string>('');
  public label = input.required<string>();
  public for = input<string | undefined>(undefined);
  public autocomplete = input<string | undefined>(undefined);
  public required = input<boolean>(false);
  public placeholder = input<string>('');
  public type = input<string>('text');
  public readonly = input<boolean>(false);
  public feedback = input<boolean>(false);
  public toggleMask = input<boolean>(true);
  public maxLength = input<number | null>(null);
  public max = input<number | undefined>(undefined);
  public min = input<number | null>(null);
  public clear = input<boolean>(false);
  public tooltip = input<string>('');
  public isDisabled = signal<boolean>(false);
  public tooltipPosition = input<string>('top');
  public textMode = input<boolean>(false);
  public onClear = output<void>();
  public onChangeValue = output<string>();

  constructor(private _cdRef: ChangeDetectorRef) {
    this._errors.set(null);
  }

  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  public onInputChange(event: any) {
    this.onChange(event.target.value);
    this.onChangeValue.emit(event.target.value);
  }

  public get isOnError(): boolean {
    const errors = this.errors;
    return errors != null && Object.keys(errors).length > 0;
  }

  public get errors() {
    if (this.control) {
      if (this.control.touched) {
        return this.control.errors;
      }
      return null;
    }
    return this._errors;
  }

  ngAfterContentChecked() {
    this._cdRef.detectChanges();
  }

  public clearValue() {
    this.onClear.emit();
    this.value.set('');
  }
}
