import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../../models/User';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  adminUrl: string = 'http://localhost:8080/api/admin';

  adminHeaders = new HttpHeaders ({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }


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

    let params = new HttpParams().set("username", dni)

    return this.http.delete(`${this.adminUrl}/deleteResearcher`, {headers: this.adminHeaders, params: params});
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
    
    let params = new HttpParams().set("identificationNumber", identificationNumber)

    return this.http.delete(`${this.adminUrl}/deleteSubject`, {headers: this.adminHeaders, params: params});
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
    
    console.log(`${this.adminUrl}/${username}/subjects`);
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

  
}
