import { Injectable } from '@angular/core';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class SortResearchersServiceService {

  constructor() { }

  sortUpDni(researchers: User[]){
    researchers = researchers.sort(function (a, b) {
      if (a.username.toUpperCase() > b.username.toUpperCase()) {
        return 1;
      }
      if (a.username.toUpperCase() < b.username.toUpperCase()) {
        return -1;
      }
      return 0;
    });
  }
 
  sortDownDni(researchers: User[]){
    researchers = researchers.sort(function (a, b) {
      if (a.username.toUpperCase() < b.username.toUpperCase()) {
        return 1;
      }
      if (a.username.toUpperCase() > b.username.toUpperCase()) {
        return -1;
      }
      return 0;
    });
  }

  
  sortUpName(researchers: User[]){
    researchers = researchers.sort(function (a, b) {
      if (a.name.toUpperCase() > b.name.toUpperCase()) {
        return 1;
      }
      if (a.name.toUpperCase() < b.name.toUpperCase()) {
        return -1;
      }
      return 0;
    });
  }

  sortDownName(researchers: User[]){
    researchers = researchers.sort(function (a, b) {
      if (a.name.toUpperCase() < b.name.toUpperCase()) {
        return 1;
      }
      if (a.name.toUpperCase() > b.name.toUpperCase()) {
        return -1;
      }
      return 0;
    });
  }

  sortUpGender(researchers: User[]){
    researchers = researchers.sort(function (a, b) {
      if (a.gender.toUpperCase() > b.gender.toUpperCase()) {
        return 1;
      }
      if (a.gender.toUpperCase() < b.gender.toUpperCase()) {
        return -1;
      }
      return 0;
    });
  }

  sortDownGender(researchers: User[]){
    researchers = researchers.sort(function (a, b) {
      if (a.gender.toUpperCase() < b.gender.toUpperCase()) {
        return 1;
      }
      if (a.gender.toUpperCase() > b.gender.toUpperCase()) {
        return -1;
      }
      return 0;
    });
  }
}
