import { CommonModule } from '@angular/common';
import { Component, ContentChild, input, signal } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { InputErrorLabelComponent } from '../input-error-label/input-error-label.component';
import { HasErrorRootDirective } from '../../../directives/has-error-root.directive';

@Component({
  standalone: true,
  imports: [InputErrorLabelComponent, CommonModule],
  selector: 'app-input-wrapper',
  templateUrl: './input-wrapper.component.html',
  styleUrls: ['./input-wrapper.component.scss'],
})
export class InputWrapperComponent {
  @ContentChild(HasErrorRootDirective) hasErrorRoot!: HasErrorRootDirective;

  public label = input<string | undefined>(undefined);
  public for = input<string | undefined>(undefined);
  public required = input<boolean>(false);
  public isFlex = input<boolean>(false);
  public errors = input<ValidationErrors | null>(null);
  public hideLabel = input<boolean>(false);
  public darkTheme = signal<boolean>(false);

  constructor() {
    this.darkTheme.set(localStorage['theme'] == 'dark');
  }
}
