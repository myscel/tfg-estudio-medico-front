import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordInputServiceService {

  constructor() { }


  validateEmptyField(password: string): boolean {
    return !(password === undefined || password === "");
  }

  validateLengthPass(password: string): boolean {
    return password.trim().length >= 5;
  }
}
