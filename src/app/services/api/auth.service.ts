import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { tap } from 'rxjs/operators';
import { StorageService } from '../utils/storage.service';
import { AuthModel, UserRole } from '../../models/auth.model';
import { ApiResponse } from '../../models/common.model';
import { RootRoutes } from '../../utils/root-routes';
import { EncryptService } from '../utils/encrypt.service';

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

  get authData(): AuthModel | null {
    const authData =
      sessionStorage.getItem(authStorageKey) ||
      localStorage.getItem(authStorageKey);
    return authData ? JSON.parse(authData) : null;
  }

  set authData(res: AuthModel) {
    let info: AuthModel = {
      refreshToken: res.refreshToken,
      token: res.token,
      redirectTo: res.redirectTo,
    };

    const tokenData: any = this.decodeToken(res.token);
    if (tokenData) {
      info = {
        ...info,
        userInfo: {
          nome: tokenData['FirstName'],
          cognome: tokenData['LastName'],
          email: tokenData['email'],
          role: tokenData['Role'] == 'System' ? UserRole.System : UserRole.User,
          userId: +tokenData['unique_name'],
        },
      };
    }
    if (info) {
      this._storageService.set(authStorageKey, info);
    }
  }

  public login(email: string, password: string) {
    return this._http
      .post<ApiResponse<AuthModel>>(`${this._baseUrl}`, {
        email,
        password: this._encryptService.encrypt(password),
      })
      .pipe(
        tap((data) => {
          this.authData = data.result;
        })
      );
  }

  /**
   * Logs out the user and clear authData.
   * @return {Observable<boolean>} True if the user was logged out successfully.
   */
  public logout() {
    this._storageService.clear();
    this._router.navigate([RootRoutes.HOME]);
  }

  public decodeToken(token: string): any {
    try {
      const jwtInfo = jwtDecode(token);
      return jwtInfo;
    } catch (error) {
      console.error('Error decoding token', error);
      return undefined;
    }
  }
}
