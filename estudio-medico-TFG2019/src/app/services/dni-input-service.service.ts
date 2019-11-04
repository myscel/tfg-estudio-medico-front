import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DniInputServiceService {

  constructor() { }

  validateEmptyField(dni: string): boolean {
    return !(dni === undefined || dni === "");
  }

  validateDNI(dni: string): boolean {
    var regExpresion = /^[0-9]{8,8}[A-Za-z]$/;
    //Check length and format
    if(dni.length !== 9 || !regExpresion.test(dni)){
      return false;
    }
    return true;
  }
}
