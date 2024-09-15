import { Component, output, signal } from '@angular/core';
import { SimpleDialogComponent } from '../../shared/components/simple-dialog/simple-dialog.component';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { SupplierReview } from '../../../models/supplier.model';
import { DropdownComponent } from '../../shared/components/input/dropdown/dropdown.component';
import { TextInputComponent } from '../../shared/components/input/text-input/text-input.component';
import { TextareaInputComponent } from '../../shared/components/input/textarea-input/textarea-input.component';

@Component({
  standalone: true,
  imports: [
    SimpleDialogComponent,
    ReactiveFormsModule,
    TextInputComponent,
    DropdownComponent,
    ButtonModule,
    TextareaInputComponent,
    RatingModule,
  ],
  selector: 'app-add-review',
  templateUrl: './add-review-form.component.html',
  styleUrl: './add-review-form.component.scss',
})
export class AddReviewFormComponent {
  public onSave = output<SupplierReview>();
  public form = signal<FormGroup | undefined>(undefined);

  constructor(private _fb: FormBuilder) {
    this.buildForm();
  }

  public buildForm(item?: SupplierReview) {
    this.form.set(
      this._fb.group({
        id: [item?.id],
        value: [item?.value, [Validators.required]],
        body: [item?.body, [Validators.required]],
      })
    );
  }

  public onAdd() {
    if (this.form()!.valid) {
      const formData = this.form()?.getRawValue();
      this.onSave.emit(formData);
    }
  }

  public resetForm() {
    this.form()?.reset();
  }
}
