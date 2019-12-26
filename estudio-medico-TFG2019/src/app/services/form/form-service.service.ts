import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

  constructor() { }


  validateVitaminD(vitamminDValue: string): boolean{
    let vitamin = parseFloat(vitamminDValue);

    if(vitamin.toString().length !== vitamminDValue.length) {
      return false
    }

    if(isNaN(vitamin)){
      return false;
    }
    return vitamin >= 0 && vitamin <= 500;
  }

  validateHbA1c(hbA1cValue: string): boolean{
    let hbA1c = parseFloat(hbA1cValue);

    if(hbA1c.toString().length !== hbA1cValue.length) {
      return false;
    }

    if(isNaN(hbA1c)){
      return false;
    }
    return hbA1c >= 1 && hbA1c <= 40;
  }

  validateSunExposure(sunExposureValue: string): boolean{
    let sunExposure = parseFloat(sunExposureValue);

    if(sunExposure.toString().length !== sunExposureValue.length) {
      return false;
    }

    if(isNaN(sunExposure)){
      return false;
    }
    return sunExposure >= 0 && sunExposure <= 1200;
  }

  validateExercise(exerciseValue: string): boolean{
    let exercise = parseFloat(exerciseValue);

    if(exercise.toString().length !== exerciseValue.length) {
      return false;
    }

    if(isNaN(exercise)){
      return false;
    }
    return exercise >= 0 && exercise <= 700;
  }

  validateGlucose(glucoseValue: string): boolean{
    let glucose = parseFloat(glucoseValue);

    if(glucose.toString().length !== glucoseValue.length) {
      return false
    }

    if(isNaN(glucose)){
      return false;
    }
    return glucose >= 0 && glucose <= 700;
  }

  validateImc(imcValue: string): boolean{
    let imc = parseFloat(imcValue);

    if(imc.toString().length !== imcValue.length) {
      return false
    }

    if(isNaN(imc)){
      return false;
    }
    return imc >= 10 && imc <= 70;
  }

  validateTas(tasValue: string): boolean{
    let tas = parseFloat(tasValue);

    if(tas.toString().length !== tasValue.length) {
      return false
    }

    if(isNaN(tas)){
      return false;
    }
    return tas >= 20 && tas <= 300;
  }

  validateTad(tadValue: string): boolean{
    let tad = parseFloat(tadValue);

    if(tad.toString().length !== tadValue.length) {
      return false
    }

    if(isNaN(tad)){
      return false;
    }
    return tad >= 20 && tad <= 200;
  }

  validateCholesterol(cholesterolValue: string): boolean{
    let cholesterol = parseFloat(cholesterolValue);

    if(cholesterol.toString().length !== cholesterolValue.length) {
      return false
    }

    if(isNaN(cholesterol)){
      return false;
    }
    return cholesterol >= 50 && cholesterol <= 900;
  }

  validateLdlAndHdl(lValue: string): boolean{
    let lipid = parseFloat(lValue);

    if(lipid.toString().length !== lValue.length) {
      return false
    }

    if(isNaN(lipid)){
      return false;
    }
    return lipid >= 1 && lipid <= 400;
  }

  validateTg(tgValue: string): boolean{
    let tg = parseFloat(tgValue);

    if(tg.toString().length !== tgValue.length) {
      return false
    }

    if(isNaN(tg)){
      return false;
    }
    return tg >= 1 && tg <= 10000;
  }

  validateCreatinine(creatinineValue: string): boolean{
    let creatinine = parseFloat(creatinineValue);

    if(creatinine.toString().length !== creatinineValue.length) {
      return false
    }

    if(isNaN(creatinine)){
      return false;
    }
    return creatinine >= 0 && creatinine <= 30;
  }
}
