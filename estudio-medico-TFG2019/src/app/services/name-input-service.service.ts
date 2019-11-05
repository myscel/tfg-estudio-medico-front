import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NameInputServiceService {

  constructor() { }

  validateEmptyField(name: string): boolean {
    return !(name === undefined || name.trim() === "");
  }
}
