import { Inject, Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Environment } from '../../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class EncryptService {
  public environment: Environment;

  constructor(@Inject('environment') environment: Environment) {
    this.environment = environment;
  }

  public encrypt(plaintext: string): string {
    return CryptoJS.AES.encrypt(
      plaintext,
      this.environment.publicKey
    ).toString();
  }

  public decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.environment.publicKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
