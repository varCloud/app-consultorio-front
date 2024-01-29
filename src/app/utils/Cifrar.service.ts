import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CifrarService {
  private storage: any;

  keys = 'BlueCloud'
  constructor() {
    //this.storage = localStorage;
  }

  /*
  public getKey(key: string): any {
    const item = this.storage.getItem(key);

    if (item && item !== 'undefined') {
      return JSON.parse(this.getDec(item));
    }
    return undefined;
  }

  public setKey(key: string, value: any) {
    this.storage.setItem(key, this.setEnc(JSON.stringify(value)));
  }
  */

  public setEnc(value) {
    // var key = CryptoJS.enc.Utf8.parse(this.keys);
    // var iv = CryptoJS.enc.Utf8.parse(this.keys);
    // var encryptInfo = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(value), key,
    //   {
    //     keySize: 128 / 8,
    //     iv: iv,
    //     mode: CryptoJS.mode.CBC,
    //     padding: CryptoJS.pad.Pkcs7
    //   }).toString());
    return JSON.stringify(value);
    let encryptInfo = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(value), this.keys).toString());
    return encryptInfo;
  }

  public getDec(value) {

    // var key = CryptoJS.enc.Utf8.parse(this.keys);
    // var iv = CryptoJS.enc.Utf8.parse(this.keys);
    // var deData = CryptoJS.AES.decrypt(decodeURIComponent(value), key, {
    //   keySize: 128 / 8,
    //   iv: iv,
    //   mode: CryptoJS.mode.CBC,
    //   padding: CryptoJS.pad.Pkcs7
    //});

    //Decrypt Info
    return JSON.parse(value);
    if (value) {
      var deData = CryptoJS.AES.decrypt(decodeURIComponent(value), this.keys);
      var decryptedInfo = JSON.parse(deData.toString(CryptoJS.enc.Utf8));
    }
    return decryptedInfo;
  }


  public generarContrasena(texto) {
    try {
      return CryptoJS.HmacSHA256(texto, this.keys).toString(CryptoJS.enc.Hex)

    } catch (error) {
      throw error;
    }

  }

  public setEncString(value) {
    let encryptInfo = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(value), this.keys).toString());
    return encryptInfo;
  }

  getDecString(value) {
    if (value) {
      var deData = CryptoJS.AES.decrypt(decodeURIComponent(value), this.keys);
      return deData.toString(CryptoJS.enc.Utf8);
    }
    return "";
  }
}
