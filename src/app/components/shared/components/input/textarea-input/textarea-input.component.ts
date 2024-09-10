import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  forwardRef,
  input,
  model,
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
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputWrapperComponent } from '../input-wrapper/input-wrapper.component';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextareaModule,
    FormsModule,
    InputWrapperComponent,
  ],
  selector: 'app-textarea-input',
  templateUrl: './textarea-input.component.html',
  styleUrls: ['./textarea-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaInputComponent),
      multi: true,
    },
  ],
})
export class TextareaInputComponent implements ControlValueAccessor {
  @Input() set errors(errors: ValidationErrors | null) {
    this._errors.set(errors);
  }
  @Input() control: AbstractControl<any, any> | undefined;
  public label = input.required<string>();
  public for = input<string | undefined>(undefined);
  public required = input<boolean>(false);
  public placeholder = input<string>('');
  public rows = input<number>(5);
  public readonly = input<boolean>(false);
  public textMode = input<boolean>(false);
  public value = model<string>('');
  public onChange: any = () => {};
  public onTouched: any = () => {};
  public isDisabled = signal<boolean>(true);
  private _errors = signal<ValidationErrors | null>(null);
  constructor(private cdref: ChangeDetectorRef) {
    this.control = undefined;
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
    this.cdref.detectChanges();
  }
}
