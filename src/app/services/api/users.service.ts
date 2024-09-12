import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { RegisteredUser, UsersSearchPayload } from '../../models/user.model';
import { LoaderStatusService } from '../utils/loader-status.service';
import { StorageService } from '../utils/storage.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  // private readonly _baseUrl = 'Users';

  constructor(
    private _storageService: StorageService, // private _http: HttpClient
    private _loaderService: LoaderStatusService
  ) {}

  public getUsers(searchPayload: UsersSearchPayload) {
    //Simulazione loader, di solito si utilizza un interceptor
    this._loaderService.show();
    let users: RegisteredUser[] = this._storageService.get('users');
    if (!users) {
      this._storageService.set('users', []);
    }
    users = this._storageService.get('users');

    if (!!searchPayload.searchText) {
      users = users.filter(
        (el) =>
          el.email.includes(searchPayload.searchText!) ||
          el.username.includes(searchPayload.searchText!)
      );
    }
    if (searchPayload.userType) {
      users = users.filter((el) => el.userType == searchPayload.userType);
    }
    this._loaderService.hide();

    return of(users);
  }
}
