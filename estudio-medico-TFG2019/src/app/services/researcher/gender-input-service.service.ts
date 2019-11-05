import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenderInputServiceService {

  constructor() { }

  validateEmptyField(gender: string): boolean {
    return !(gender === undefined || gender.trim() === "");
  }
}
