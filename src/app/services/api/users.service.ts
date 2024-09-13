import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import {
  RegisteredUser,
  UserBaseModel,
  UsersSearchPayload,
} from '../../models/user.model';
import { LoaderStatusService } from '../utils/loader-status.service';
import { StorageService } from '../utils/storage.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private users: RegisteredUser[] = []; // Store users in memory

  constructor(
    private _storageService: StorageService,
    private _loaderService: LoaderStatusService
  ) {}

  public getUsers(searchPayload: UsersSearchPayload) {
    this._loaderService.show();
    this.users = this._storageService.get('users') || [];
    const filteredUsers = this.users.filter((user) => {
      let match = true;
      if (searchPayload.searchText) {
        match =
          user.email.includes(searchPayload.searchText!) ||
          user.username.includes(searchPayload.searchText!);
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

    this.users = this._storageService.get('users') || [];
    const foundIndex = this.users.findIndex((el) => el.id === user.id);
    if (foundIndex !== -1) {
      this.users[foundIndex] = { ...this.users[foundIndex], ...user };
      this._storageService.set('users', this.users);
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

    this.users = this._storageService.get('users') || [];
    const foundUser = this.users.find((el) => el.email === user.email);
    if (foundUser) {
      this._loaderService.hide();
      return throwError(() => new Error('Email già presente nel sistema'));
    } else {
      const newUser = {
        ...user,
        password: 'TEMPORARYPASSWORD',
        id:
          this.users.length > 0 ? this.users[this.users.length - 1].id + 1 : 0,
      };
      this.users.push(newUser);
      this._storageService.set('users', this.users);
      this._loaderService.hide();
      return of(true);
    }
  }
  public delete(user: RegisteredUser) {
    this._loaderService.show();

    this.users = this._storageService.get('users') || [];
    const userIdx = this.users.findIndex((el) => el.id === user.id);
    if (userIdx) {
      this.users.splice(userIdx, 1);

      this._storageService.set('users', this.users);
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
}
