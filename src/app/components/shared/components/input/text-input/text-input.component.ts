import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  input,
  Input,
  model,
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
import { TooltipModule } from 'primeng/tooltip';
import { InputWrapperComponent } from '../input-wrapper/input-wrapper.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    InputWrapperComponent,
    TooltipModule,
  ],
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() set errors(errors: ValidationErrors | null) {
    this._errors.set(errors);
  }
  @Input() control: AbstractControl<any, any> | undefined;
  public inputClass = input<{ [klass: string]: any } | undefined>(undefined);
  public onChange: any = () => {};
  public onTouched: any = () => {};
  public label = input.required<string>();
  public for = input<string | undefined>(undefined);
  public autocomplete = input<string | undefined>(undefined);
  public required = input<boolean>(false);
  public placeholder = input<string>('');
  public type = input<string>('text');
  public readonly = input<boolean>(false);
  public maxLength = input<number | null>(null);
  public max = input<number | null>(null);
  public min = input<number | null>(null);
  public clear = input<boolean>(false);
  public class = input<string>('');
  public tooltip = input<string>('');
  public hideLabel = input<boolean>(false);
  public tooltipPosition = input<string>('top');
  public textMode = input<boolean>(false);
  public onClear = output<void>();
  public onChangeValue = output<string>();
  public value = model<string>('');
  public isDisabled = model<boolean>(false);
  private _errors = signal<ValidationErrors | null>(null);
  constructor(private _cdRef: ChangeDetectorRef) {
    this._errors.set(null);
  }

  public writeValue(value: any): void {
    this.value.set(value);
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
    return this._errors();
  }

  ngAfterContentChecked() {
    this._cdRef.detectChanges();
  }

  public clearValue() {
    this.onClear.emit();
    this.value.set('');
  }

  public getInputClasses() {
    return {
      'ng-invalid ng-dirty': this.isOnError,
      'readonly-input': this.readonly(),
      ...this.inputClass(),
    };
  }
}
