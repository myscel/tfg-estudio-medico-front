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
}
