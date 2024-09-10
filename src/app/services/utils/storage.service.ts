import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { User } from '../../models/user.model';
import { authStorageKey } from '../api/auth.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storage: Storage | null;

  public me: BehaviorSubject<User | undefined> = new BehaviorSubject<
    User | undefined
  >(undefined);

  constructor(private _http: HttpClient) {
    this.storage = this.getStorage();
  }

  public getStorage(): Storage | null {
    let storage = null;
    if (localStorage[authStorageKey]) {
      storage = localStorage;
    } else if (sessionStorage[authStorageKey]) {
      storage = sessionStorage;
    }
    return storage;
  }

  public get(key: string): any | null {
    const data = localStorage.getItem(key);

    if (!data) {
      return null;
    }
    return JSON.parse(localStorage.getItem(key)!);
  }

  public set(key: string, value: any) {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  }

  public clear() {
    localStorage.clear();
  }
}
