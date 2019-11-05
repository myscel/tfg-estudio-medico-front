import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SurnameInputServiceService {

  constructor() { }

  validateEmptyField(surname: string): boolean {
    return !(surname === undefined || surname.trim() === "");
  }
}
