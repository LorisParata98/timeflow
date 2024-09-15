import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import {
  AuthService,
  authStorageKey,
} from '../../../services/api/auth.service';
import { SuppliersService } from '../../../services/api/suppliers.service';
import { OperationStatusHandler } from '../../../services/utils/operation-status.service';
import { StorageService } from '../../../services/utils/storage.service';
import { RootRoutes } from '../../../utils/root-routes';
import { UserUtils } from '../../../utils/UserUtils';
import { DropdownComponent } from '../../shared/components/input/dropdown/dropdown.component';
import { InputPasswordComponent } from '../../shared/components/input/input-password/input-password.component';
import { TextInputComponent } from '../../shared/components/input/text-input/text-input.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TextInputComponent,
    InputPasswordComponent,
    DropdownComponent,
  ],
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  public loginForm = signal<FormGroup | undefined>(undefined);
  public isSignUp = signal<boolean>(false);
  private _storage = signal<Storage | null | undefined>(undefined);

  public userTypes = signal<SelectItem[]>([]);

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _suppliersService: SuppliersService,
    private _operationStatusHandler: OperationStatusHandler,
    private _storageService: StorageService
  ) {
    this.loginForm.set(this._getForm());
    this.userTypes.set(UserUtils.userRoles);
  }

  ngOnInit() {
    this._storage.set(this._storageService.getStorage());
    if (this._storage() && this._storage()![authStorageKey]) {
      this._handleLogin();
    }
  }

  private _getForm(): FormGroup {
    return this._fb.group({
      username: [null],
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      userType: [null],
    });
  }

  public onLoginSubmit() {
    this.loginForm()!.markAllAsTouched();
    if (this.loginForm()!.valid) {
      const formData = this.loginForm()?.getRawValue();
      if (this.isSignUp()) {
        this._authService.signUp(formData).subscribe({
          next: (_) => {
            this._operationStatusHandler.success(
              'Registrazione effettuata con successo, effettua il login e accedi alla piattaforma'
            );
            this.isSignUp.set(false);

            this.loginForm.set(this._getForm());
            this.loginForm.update((oldValue) => {
              oldValue?.get('email')?.setValue(formData.email);
              return oldValue;
            });
          },
          error: this._onLoginError.bind(this),
        });
      } else {
        this._authService.login(formData.email, formData.password).subscribe({
          next: (_) => {
            this._operationStatusHandler.success(
              'Login effettuato con successo!'
            );
            this._handleLogin();
          },
          error: this._onLoginError.bind(this),
        });
      }
    }
  }

  private async _onLoginError(ex: any) {
    this._operationStatusHandler.error(ex.message);
  }

  public goToEnrollmentPage() {
    this.isSignUp.update((oldValue) => !oldValue);
    if (this.isSignUp()) {
      this.loginForm.update((oldValue) => {
        oldValue?.get('username')?.setValidators([Validators.required]);
        oldValue?.get('userType')?.setValidators([Validators.required]);
        oldValue?.updateValueAndValidity();
        return oldValue;
      });
    }
  }

  private async _handleLogin() {
    if (!this._storageService.get('suppliers')) {
      await this._suppliersService._loadSuppliersInStorage();
    }
    this._router.navigate([RootRoutes.DASHBOARD]);
  }
}
