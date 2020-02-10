import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../../models/User';
import {Observable} from 'rxjs';
import { Appointment } from 'src/app/models/Appointment';
import { ConstantsService } from '../constants/constants.service';


@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  adminUrl: string = `http://${this.constantsService.localHost}:8080/api/admin`;

  adminHeaders = new HttpHeaders ({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient,
    private constantsService: ConstantsService) { }


  public getAllResearchers(): Observable<any> {
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null){
      return null;
    }

    return this.http.get(`${this.adminUrl}/users`, {headers: this.adminHeaders});
  }

  public deleteResearcher(dni: string): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));
    if(userLogged === null){
      return null;
    }

    let dniAux = {"username": dni};


    return this.http.post(`${this.adminUrl}/deleteResearcher`, dniAux,  {headers: this.adminHeaders});
  }

  public registerResearcher(user: User): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));
    if(userLogged === null){
      return null;
    }

    return this.http.post(`${this.adminUrl}/registerResearcher`,user , {headers: this.adminHeaders});
  }

  public getAllSubjects(): Observable<any> {
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null){
      return null;
    }

    return this.http.get(`${this.adminUrl}/subjects`, {headers: this.adminHeaders});
  }

  public getSubjectsAndInvestigationsFromIdAdmin(id: string): Observable<any> {
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null){
      return null;
    }

    return this.http.get(`${this.adminUrl}/${id}/subjects`, {headers: this.adminHeaders});
  }

  public deleteSubjectByIdentificationNumber(identificationNumber: string): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null){
      return null;
    }

    let idNumber = {"identificationNumber": identificationNumber};

    let params = new HttpParams().set("identificationNumber", identificationNumber)

    return this.http.post(`${this.adminUrl}/deleteSubject`,idNumber,  {headers: this.adminHeaders});
  }

  public getNumberInvestigationsCompletedFromSubject(identificationNumber: string): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null){
      return null;
    }
    
    return this.http.get(`${this.adminUrl}/investigationsCompletedSubject/${identificationNumber}`, {headers: this.adminHeaders});
  }

  public getSubjectByIdentificationNumber(identificationNumber: string): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null){
      return null;
    }
    
    return this.http.get(`${this.adminUrl}/subjects/${identificationNumber}`, {headers: this.adminHeaders});
  }

  public getSubjectsByResearcherDNI(username: string): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null){
      return null;
    }
    
    return this.http.get(`${this.adminUrl}/${username}/subject`, {headers: this.adminHeaders});
  }

  public getResearcherByID(id: string): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null){
      return null;
    }
    
    return this.http.get(`${this.adminUrl}/researchers/${id}`, {headers: this.adminHeaders});
  }

  public updateResearcher(user: User): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));
    
    if(userLogged === null){
      return null;
    }

    return this.http.post(`${this.adminUrl}/updateResearcher`,user , {headers: this.adminHeaders});
  }

  public getAllCompletedAppointments(): Observable<any> {

    return this.http.get(`${this.adminUrl}/completedAppointments`, {headers: this.adminHeaders});
  }

  public getAppointmentDetails(investigationsDetailsId: string): Observable<any> { 

    return this.http.get(`${this.adminUrl}/getAppointmentDetails/${investigationsDetailsId}`, {headers: this.adminHeaders});
  }

  public updateAppointmentDetails(appointment: Appointment): Observable<any>{

    return this.http.post(`${this.adminUrl}/updateInvestigationDetails`, appointment, {headers: this.adminHeaders});
  }

  checkAdminProfile(): boolean{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null){
      return false;
    }

    return userLogged.role === "ADMIN";
  }
  
}
