import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../../models/User';
import { Subject } from '../../models/Subject';
import {Observable} from 'rxjs';
import { Appointment } from 'src/app/models/Appointment';


@Injectable({
  providedIn: 'root'
})
export class ResearcherServiceService {

  researcherUrl: string = 'http://localhost:8080/api/researcher';

  researcherHeaders = new HttpHeaders ({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  public getSubjectsAndInvestigationsFromIdResearcher(id: string): Observable<any> {
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null || userLogged.token === null || userLogged.token === ""){
      return null;
    }

    let headerList: HttpHeaders = this.researcherHeaders.append('Authorization', 'Bearer ' + userLogged.token);

    return this.http.get(`${this.researcherUrl}/${id}/subjects`, {headers: headerList});
  }

  public registerSubject(subject: Subject): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));
    if(userLogged === null || userLogged.token === null || userLogged.token === ""){
      return null;
    }

    let headerList: HttpHeaders = this.researcherHeaders.append('Authorization', 'Bearer ' + userLogged.token);

    return this.http.post(`${this.researcherUrl}/registerSubject`, subject , {headers: headerList});
  }

  public getNumberInvestigationsCompletedFromSubject(identificationNumber: string): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null || userLogged.token === null || userLogged.token === ""){
      return null;
    }
    
    let headerList: HttpHeaders = this.researcherHeaders.append('Authorization', 'Bearer ' + userLogged.token);

    return this.http.get(`${this.researcherUrl}/investigationsCompletedSubjectResearcher/${identificationNumber}`, {headers: headerList});
  }

  public deleteSubjectByIdentificationNumberResearcher(identificationNumber: string): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null || userLogged.token === null || userLogged.token === ""){
      return null;
    }
    
    let headerList: HttpHeaders = this.researcherHeaders.append('Authorization', 'Bearer ' + userLogged.token);
    let params = new HttpParams().set("identificationNumber", identificationNumber)

    return this.http.delete(`${this.researcherUrl}/deleteSubjectResearcher`, {headers: headerList, params: params});
  }

  public registerAppointment(appointment: Appointment): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));
    if(userLogged === null || userLogged.token === null || userLogged.token === ""){
      return null;
    }

    let headerList: HttpHeaders = this.researcherHeaders.append('Authorization', 'Bearer ' + userLogged.token);

    return this.http.post(`${this.researcherUrl}/registerInvestigationDetails`, appointment , {headers: headerList});
  }

  public getAppointmentDetails(idSubject: string, numberInvestigation: string): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));
    if(userLogged === null || userLogged.token === null || userLogged.token === ""){
      return null;
    }

    let headerList: HttpHeaders = this.researcherHeaders.append('Authorization', 'Bearer ' + userLogged.token);

    return this.http.get(`${this.researcherUrl}/getInvestigationDetails/${idSubject}/${numberInvestigation}` , {headers: headerList});
  }

  public getAllAppointmentDetails(idSubject: string): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));
    if(userLogged === null || userLogged.token === null || userLogged.token === ""){
      return null;
    }

    let headerList: HttpHeaders = this.researcherHeaders.append('Authorization', 'Bearer ' + userLogged.token);

    return this.http.get(`${this.researcherUrl}/getAllInvestigationDetails/${idSubject}` , {headers: headerList});
  }

  
}
