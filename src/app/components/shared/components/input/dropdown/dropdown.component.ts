import {
  AfterViewInit,
  Component,
  ContentChildren,
  DestroyRef,
  forwardRef,
  input,
  Input,
  model,
  output,
  QueryList,
  signal,
  TemplateRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';

import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { FormControlError } from '../../../../../utils/form/FormControlError';
import {
  DropdownItemDirective,
  DropdownItemTemplateContext,
} from '../../../directives/dropdown-item.directive';
import { InputWrapperComponent } from '../input-wrapper/input-wrapper.component';

@Component({
  standalone: true,
  imports: [
    DropdownModule,
    FormsModule,
    CommonModule,
    InputWrapperComponent,
    DropdownItemDirective,
  ],
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent
  implements ControlValueAccessor, FormControlError, AfterViewInit
{
  @ContentChildren(DropdownItemDirective)
  private _dropdownItemDirectives: QueryList<DropdownItemDirective> | undefined;

  @Input({ required: true }) set options(
    options: any[] | (() => any[]) | Observable<any[]>
  ) {
    this._options = options;
    this.initAvailableOptions(true);
  }
  public label = input<string | undefined>(undefined);
  public filter = input<boolean>(false);
  public filterBy = input<string | undefined>(undefined);
  public showClear = input<boolean>(false);
  public placeholder = input<string | undefined>(undefined);
  public for = input<string | undefined>(undefined);
  public required = input<boolean>(false);
  public readonly = input<boolean>(false);
  public optionLabel = input<string>('label');
  public optionValue = input<string>('value');
  public class = input<string>('');
  @Input() set errors(errors: ValidationErrors | null) {
    this._errors.set(errors);
  }

  public control = input<AbstractControl | undefined>(undefined);
  public textMode = input<boolean>(false);
  public inputClass = input<string | undefined>(undefined);
  public shrinkTrigger = input<boolean>(false);
  public value = model<string>('');
  public onChangeValue = output<any>();
  public onChange: any = () => {};
  public onTouched: any = () => {};
  public isDisabled = signal<boolean>(false);
  public availableOptions = signal<any[]>([]);
  private _errors = signal<ValidationErrors | null>(null);
  private _options!: any[] | (() => any[]) | Observable<any[]>;

  public showFilterOption = input<boolean>(false); //filtro per visualizzazione di opzioni all'interno della dropdown customizzate
  public shoWTruncateValue = input<boolean>(false);
  public shoWSelectValue = input<boolean>(true);
  constructor(private _destroyRef: DestroyRef) {}

  public ngAfterViewInit() {
    this.initAvailableOptions();
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

  setDisabledState(isDisabled: boolean) {
    this.isDisabled.set(isDisabled);
  }

  public onInputChange(event: DropdownChangeEvent) {
    this.onChange(event.value);
    if (this.control() && this.control()?.pristine) {
      return;
    }
    this.onChangeValue.emit(event.value);
  }

  public get readonlyLabel(): string {
    return (
      this.availableOptions().find((option) => option.value === this.value)
        ?.label ?? this.value
    );
  }

  public get isOnError(): boolean {
    const errors = this.errors;
    return errors !== null && Object.keys(errors).length > 0;
  }

  public get errors() {
    if (this.control) {
      if (this.control()?.touched) {
        return this.control()!.errors;
      }
      return null;
    }
    return this._errors();
  }

  public getLabelFromValue(value: any): string | undefined {
    return this.availableOptions().find((option) => option.value === value)
      ?.label;
  }

  public getInputClasses() {
    return `w-full ${this.readonly() ? 'readonly-input ' : ''}${
      this.shrinkTrigger() ? 'shrink-trigger ' : ''
    } ${this.inputClass() ?? ''}`;
  }

  public getDropdownItemTemplate():
    | TemplateRef<DropdownItemTemplateContext>
    | undefined {
    return this._dropdownItemDirectives?.first?.template;
  }

  public onShow() {
    this.initAvailableOptions();
  }

  public initAvailableOptions(onlyArray: boolean = false) {
    if (Array.isArray(this._options)) {
      this.availableOptions.set(this._options);
      return;
    }

    if (onlyArray) {
      return;
    }

    if (this._options instanceof Observable) {
      this._options.pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
        next: (value) => {
          this.availableOptions.set(value);
        },
      });
      return;
    }

    this.availableOptions.set(this._options());
  }
}
