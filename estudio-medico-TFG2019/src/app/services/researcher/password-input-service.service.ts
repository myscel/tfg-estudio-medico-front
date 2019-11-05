import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordInputServiceService {

  constructor() { }


  validateEmptyField(password: string): boolean {
    return !(password === undefined || password.trim() === "");
  }

  validateLengthPass(password: string): boolean {
    return password.trim().length >= 5;
  }

  validatePassAndPassRepeat(password1: string, password2: string): boolean {
    return password1.trim() === password2.trim();
  }
}
