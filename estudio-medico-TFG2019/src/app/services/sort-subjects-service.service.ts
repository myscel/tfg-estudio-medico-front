import { Injectable } from '@angular/core';
import { Subject } from '../models/Subject';

@Injectable({
  providedIn: 'root'
})
export class SortSubjectsServiceService {

  constructor() { }

  sortUpIdentificationNumber(subjects: Subject[]){
    subjects = subjects.sort(function (a, b) {
      if (a.identificationNumber > b.identificationNumber) {
        return 1;
      }
      if (a.identificationNumber < b.identificationNumber) {
        return -1;
      }
      return 0;
    });
  }

  sortDownIdentificationNumber(subjects: Subject[]){
    subjects = subjects.sort(function (a, b) {
      if (a.identificationNumber < b.identificationNumber) {
        return 1;
      }
      if (a.identificationNumber > b.identificationNumber) {
        return -1;
      }
      return 0;
    });
  }

  sortUpDniResearcher(subjects: Subject[]){
    subjects = subjects.sort(function (a, b) {
      if (a.usernameResearcher.toUpperCase() > b.usernameResearcher.toUpperCase()) {
        return 1;
      }
      if (a.usernameResearcher.toUpperCase() < b.usernameResearcher.toUpperCase()) {
        return -1;
      }
      return 0;
    });
  }

  sortDownDniResearcher(subjects: Subject[]){
    subjects = subjects.sort(function (a, b) {
      if (a.usernameResearcher.toUpperCase() < b.usernameResearcher.toUpperCase()) {
        return 1;
      }
      if (a.usernameResearcher.toUpperCase() > b.usernameResearcher.toUpperCase()) {
        return -1;
      }
      return 0;
    });
  }
}
