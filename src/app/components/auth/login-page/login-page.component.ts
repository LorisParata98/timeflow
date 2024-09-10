import { Component, DestroyRef, signal, viewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  AuthService,
  authStorageKey,
} from '../../../services/api/auth.service';
import { OperationStatusHandler } from '../../../services/utils/operation-status.service';
import { StorageService } from '../../../services/utils/storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RootRoutes } from '../../../utils/root-routes';
import { ButtonModule } from 'primeng/button';
import { TextInputComponent } from '../../shared/components/input/text-input/text-input.component';
import { InputPasswordComponent } from '../../shared/components/input/input-password/input-password.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    TextInputComponent,
    InputPasswordComponent,
  ],
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  public loginForm = signal<FormGroup | undefined>(undefined);

  private _storage = signal<Storage | null | undefined>(undefined);

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _operationStatusHandler: OperationStatusHandler,

    private _destroyRef: DestroyRef,
    private _storageService: StorageService
  ) {
    this.loginForm.set(this._getForm(false));
  }

  ngOnInit() {
    this._storage.set(this._storageService.getStorage());
    if (this._storage() && this._storage()![authStorageKey]) {
      this._handleLogin();
    }
  }

  private _getForm(remember: boolean): FormGroup {
    return this._fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      newPassword: [null],
    });
  }

  public onLoginSubmit() {
    this.loginForm()!.markAllAsTouched();
    if (this.loginForm()!.valid) {
      this._authService
        .login(
          this.loginForm()!.get('email')?.value,
          this.loginForm()!.get('password')?.value
        )
        .subscribe({
          next: (res) => {
            this._handleLogin();
          },
          error: this._onLoginError.bind(this),
        });
    }
  }

  private async _onLoginError(event: HttpErrorResponse) {
    if (event.error && event.error.error)
      this._operationStatusHandler.error(
        'Credenziali errate, si prega di riprovare'
      );
  }

  public goToEnrollmentPage() {}

  private _handleLogin() {
    if (this._authService.authData?.redirectTo == 0) {
      this._router.navigate([RootRoutes.DASHBOARD]);
    }
  }
}
