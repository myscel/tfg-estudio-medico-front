import { Injectable } from '@angular/core';
import { Appointment } from 'src/app/models/Appointment';

@Injectable({
  providedIn: 'root'
})
export class SortAppointmentsServiceService {

  constructor() { }

  sortUpIdentificationNumber(appointments: Appointment[]){
    appointments = appointments.sort(function (a, b) {
      if (a.subjectIdentificationNumber > b.subjectIdentificationNumber) {
        return 1;
      }
      if (a.subjectIdentificationNumber < b.subjectIdentificationNumber) {
        return -1;
      }
      return 0;
    });
  }

  sortDownIdentificationNumber(appointments: Appointment[]){
    appointments = appointments.sort(function (a, b) {
      if (a.subjectIdentificationNumber < b.subjectIdentificationNumber) {
        return 1;
      }
      if (a.subjectIdentificationNumber > b.subjectIdentificationNumber) {
        return -1;
      }
      return 0;
    });
  }

  sortUpNumberInvestigation(appointments: Appointment[]){
    appointments = appointments.sort(function (a, b) {
      if (a.numberInvestigation > b.numberInvestigation) {
        return 1;
      }
      if (a.numberInvestigation < b.numberInvestigation) {
        return -1;
      }
      return 0;
    });
  }

  sortDownNumberInvestigation(appointments: Appointment[]){
    appointments = appointments.sort(function (a, b) {
      if (a.numberInvestigation < b.numberInvestigation) {
        return 1;
      }
      if (a.numberInvestigation > b.numberInvestigation) {
        return -1;
      }
      return 0;
    });
  }
}
