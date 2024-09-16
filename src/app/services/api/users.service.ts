import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import {
  RegisteredUser,
  UserBaseModel,
  UsersSearchPayload,
} from '../../models/user.model';
import { EncryptService } from '../utils/encrypt.service';
import { LoaderStatusService } from '../utils/loader-status.service';
import { StorageService } from '../utils/storage.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private _storageService: StorageService,
    private _loaderService: LoaderStatusService,
    private _encryptService: EncryptService,
    private _http: HttpClient
  ) {
    this.loadDefaultUsers();
  }

  public getUsers(searchPayload: UsersSearchPayload) {
    this._loaderService.show();
    let users: RegisteredUser[] = this._storageService.get('users') || [];
    const filteredUsers = users.filter((user) => {
      let match = true;
      if (searchPayload.searchText) {
        match =
          user.email.includes(searchPayload.searchText!.toLowerCase()) ||
          user.username.includes(searchPayload.searchText!.toLowerCase());
      }
      if (searchPayload.userType != null) {
        match = match && user.userType === searchPayload.userType;
      }
      return match;
    });
    this._loaderService.hide();
    return of(filteredUsers);
  }

  public update(user: RegisteredUser) {
    this._loaderService.show();

    let users: RegisteredUser[] = this._storageService.get('users') || [];
    const foundIndex = users.findIndex((el) => el.id === user.id);
    if (foundIndex !== -1) {
      users[foundIndex] = { ...users[foundIndex], ...user };
      this._storageService.set('users', users);
      this._loaderService.hide();
      return of(true);
    } else {
      this._loaderService.hide();

      return throwError(
        () =>
          new Error(
            "Operazione fallita, l'utente inserito non è presente nel sistema."
          )
      );
    }
  }

  public add(user: UserBaseModel) {
    this._loaderService.show();

    let users: RegisteredUser[] = this._storageService.get('users') || [];
    const foundUser = users.find((el) => el.email === user.email);
    if (foundUser) {
      this._loaderService.hide();
      return throwError(() => new Error('Email già presente nel sistema'));
    } else {
      const newUser = {
        ...user,
        password: 'TEMPORARYPASSWORD',
        id: users.length > 0 ? users[users.length - 1].id + 1 : 0,
      };
      users.push(newUser);
      this._storageService.set('users', users);
      this._loaderService.hide();
      return of(true);
    }
  }
  public delete(user: RegisteredUser) {
    this._loaderService.show();

    let users: RegisteredUser[] = this._storageService.get('users') || [];
    const userIdx = users.findIndex((el) => el.id === user.id);
    if (userIdx > -1) {
      users.splice(userIdx, 1);

      this._storageService.set('users', users);
      this._loaderService.hide();
      return of(true);
    } else {
      this._loaderService.hide();
      return throwError(
        () =>
          new Error("Operazione fallita, l'utente non è presente nel sistema")
      );
    }
  }

  public loadDefaultUsers() {
    if (
      localStorage.getItem('users') == null ||
      localStorage.getItem('users')!.length < 1
    ) {
      this._http
        .get<RegisteredUser[]>('mock_data/users.json')
        .subscribe((res) => {
          this._storageService.set(
            'users',
            res.map((el) => ({
              ...el,
              password: this._encryptService.encrypt(el.password),
            }))
          );
        });
    }
  }
}
