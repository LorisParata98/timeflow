import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { of, tap, throwError } from 'rxjs';
import { RegisteredUser, UserBaseModel } from '../../models/user.model';
import { RootRoutes } from '../../utils/root-routes';
import { EncryptService } from '../utils/encrypt.service';
import { StorageService } from '../utils/storage.service';

export const authStorageKey = 'authData';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _baseUrl = 'Authentication';

  constructor(
    private _storageService: StorageService,
    private _encryptService: EncryptService,
    private _router: Router,
    private _http: HttpClient
  ) {}

  get authData(): RegisteredUser | undefined {
    const authData =
      sessionStorage.getItem(authStorageKey) ||
      localStorage.getItem(authStorageKey);
    return authData ? JSON.parse(authData) : undefined;
  }

  set authData(info: RegisteredUser) {
    if (info) this._storageService.set(authStorageKey, info);
  }

  public login(email: string, password: string) {
    let users: RegisteredUser[] = this._storageService.get('users');

    if (!users) {
      this._storageService.set('users', []);
    }
    users = this._storageService.get('users');
    if (users.length > 0) {
      const foundUser = users.find(
        (el) =>
          el.email === email &&
          this._encryptService.decrypt(el.password) === password
      );
      if (foundUser) {
        const response = {
          error: false,
          result: foundUser,
        };
        return of(response).pipe(tap((data) => (this.authData = data.result)));
      } else {
        return throwError(() => new Error('Credenziali errate'));
      }
    } else {
      return throwError(() => new Error('Nessun utente presente'));
    }
  }

  public signUp(user: UserBaseModel) {
    let users: RegisteredUser[] = this._storageService.get('users');
    const encryptPwd = this._encryptService.encrypt(user.password);
    if (!users) {
      this._storageService.set('users', []);
    }
    users = this._storageService.get('users');

    if (users.length > 0) {
      const foundUser = users.find((el) => el.email === user.email);
      if (foundUser) {
        return throwError(() => new Error('Utente già presente trovato'));
      } else {
        users.push({
          ...user,
          password: encryptPwd,
          id: users.length > 0 ? users[users.length - 1].id + 1 : 0,
        });
        this._storageService.set('users', users);
        return of(true);
      }
    } else {
      users.push({
        ...user,
        password: encryptPwd,
        id: users.length > 0 ? users[users.length - 1].id + 1 : 0,
      });
      this._storageService.set('users', users);
      return of(true);
    }
  }

  public logout() {
    this._storageService.clear();
    this._router.navigate([RootRoutes.HOME]);
  }
}
