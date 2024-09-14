import {
  Component,
  DestroyRef,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { SimpleDialogComponent } from '../../shared/components/simple-dialog/simple-dialog.component';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RegisteredUser } from '../../../models/user.model';
import { UsersService } from '../../../services/api/users.service';
import { UserUtils } from '../../../utils/UserUtils';
import { DropdownComponent } from '../../shared/components/input/dropdown/dropdown.component';
import { TextInputComponent } from '../../shared/components/input/text-input/text-input.component';

@Component({
  standalone: true,
  imports: [
    SimpleDialogComponent,
    ReactiveFormsModule,
    TextInputComponent,
    DropdownComponent,
    ButtonModule,
  ],
  selector: 'app-add-review-dialog',
  templateUrl: './add-review-dialog.component.html',
  styleUrl: './add-review-dialog.component.scss',
})
export class AddReviewDialogComponent {
  dialog = viewChild<SimpleDialogComponent | undefined>('dialog');
  public editMode = signal<boolean>(true);
  public onSave = output<RegisteredUser>();
  public form = signal<FormGroup | undefined>(undefined);
  public userTypes = signal<SelectItem[]>([]);

  constructor(
    private _fb: FormBuilder,
    private _userService: UsersService,
    private _destroyRef: DestroyRef
  ) {
    this.userTypes.set(UserUtils.userRoles);
  }

  public show(item?: RegisteredUser) {
    this._buildForm(item);

    this.dialog()?.show();
  }
  public close() {
    this.dialog()?.close();
  }
  private _buildForm(item?: RegisteredUser) {
    this.form.set(
      this._fb.group({
        id: [item?.id],
        username: [item?.username, [Validators.required]],
        email: [item?.email, [Validators.email, Validators.required]],
        userType: [item?.userType, [Validators.required]],
      })
    );
  }

  public onAddUser() {
    if (this.form()!.valid) {
      const formData = this.form()?.getRawValue();

      this.onSave.emit(formData);
    }
  }
}
