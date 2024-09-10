import { JSEncrypt } from 'jsencrypt';
import { Inject, Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Environment } from '../../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class EncryptService {
  private _encrypt: JSEncrypt;
  public environment: Environment;

  constructor(@Inject('environment') environment: Environment) {
    this._encrypt = new JSEncrypt();
    this._encrypt.setPublicKey(environment.publicKey);
    this.environment = environment;
  }

  public encrypt(plaintext: string): string {
    return this._encrypt.encrypt(plaintext).toString();
  }

  decrypt(privateKey: string, pin: string, data: string): string {
    const keyHash = CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(privateKey));
    const key = CryptoJS.lib.WordArray.create(keyHash.words.slice(0, 8), 32);

    const pinHash = CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(pin));
    const iv = CryptoJS.lib.WordArray.create(pinHash.words.slice(0, 4), 16);

    const cfg = { iv: iv };

    const decrypted = CryptoJS.AES.decrypt(data, key, cfg);

    const outputDecrypted = decrypted.toString(CryptoJS.enc.Utf8);
    return outputDecrypted;
  }
}
