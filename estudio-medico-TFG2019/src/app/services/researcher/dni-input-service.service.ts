import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DniInputServiceService {

  constructor() { }

  validateEmptyField(dni: string): boolean {
    return !(dni === undefined || dni.trim() === "");
  }

  validateDNI(dni: string): boolean {
    var regExpresion = /^[0-9]{8,8}[A-Za-z]$/;
    //Check length and format
    if(dni.length !== 9 || !regExpresion.test(dni)){
      return false;
    }
    return true;
  }

  validateNIE(nie: string): boolean {
    var regExpresion =  /^[XYZ]{1}[0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i;
    //Check length and format
    if(nie.length !== 9 || !regExpresion.test(nie)){
      return false;
    }
    return true;
  }

}
