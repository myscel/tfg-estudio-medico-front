import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdentificationNumberSubjectServiceService {

  constructor() { }

  validateEmptyField(identificationNumber: string): boolean {
    return !(identificationNumber === undefined || identificationNumber.trim() === "");
  }

  validateNumberField(identificationNumber): boolean {
    return !isNaN(identificationNumber);
  }

  validateIdentificationNumberLenght(identificationNumber: string): boolean {
    return identificationNumber.trim().length === 8
  }
}
