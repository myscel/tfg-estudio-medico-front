import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../../models/User';
import { Subject } from '../../models/Subject';
import {Observable} from 'rxjs';
import { Appointment } from 'src/app/models/Appointment';
import { ConstantsService } from '../constants/constants.service';
import { UserToUpdatePass } from 'src/app/models/UserToUpdatePass';


@Injectable({
  providedIn: 'root'
})
export class ResearcherServiceService {

  researcherUrl: string = `http://${this.constantsService.localHost}:8080/api/researcher`;

  researcherHeaders = new HttpHeaders ({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient,
    private constantsService: ConstantsService) { }

  public getSubjectsAndInvestigationsFromIdResearcher(id: string): Observable<any> {
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null){
      return null;
    }

    return this.http.get(`${this.researcherUrl}/${id}/subjects`, {headers: this.researcherHeaders});
  }

  public registerSubject(subject: Subject): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));
    
    if(userLogged === null){
      return null;
    }

    return this.http.post(`${this.researcherUrl}/registerSubject`, subject , {headers: this.researcherHeaders});
  }

  public getNumberInvestigationsCompletedFromSubject(identificationNumber: string): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null){
      return null;
    }
    
    return this.http.get(`${this.researcherUrl}/investigationsCompletedSubjectResearcher/${identificationNumber}`, {headers: this.researcherHeaders});
  }

  public registerAppointment(appointment: Appointment): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));
    
    if(userLogged === null){
      return null;
    }

    return this.http.post(`${this.researcherUrl}/registerInvestigationDetails`, appointment , {headers: this.researcherHeaders});
  }

  public getAppointmentDetails(idSubject: string, numberInvestigation: string): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));
   
    if(userLogged === null){
      return null;
    }

    return this.http.get(`${this.researcherUrl}/getInvestigationDetails/${idSubject}/${numberInvestigation}` , {headers: this.researcherHeaders});
  }

  public getAllAppointmentDetails(idSubject: string): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));
    
    if(userLogged === null){
      return null;
    }

    return this.http.get(`${this.researcherUrl}/getAllInvestigationDetails/${idSubject}` , {headers: this.researcherHeaders});
  }

  public updatePassword(userToUpdate: UserToUpdatePass): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));
    
    if(userLogged === null){
      return null;
    }
    
    return this.http.post(`${this.researcherUrl}/updatePassword`, userToUpdate , {headers: this.researcherHeaders});
  }
  
}
