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

    if(userLogged === null || userLogged.token === null || userLogged.token === ""){
      return null;
    }

    let headerList: HttpHeaders = this.adminHeaders.append('Authorization', 'Bearer ' + userLogged.token);

    return this.http.get(`${this.adminUrl}/users`, {headers: headerList});
  }

  public deleteResearcher(dni: string): Observable<any>{

    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));
    if(userLogged === null || userLogged.token === null || userLogged.token === ""){
      return null;
    }

    let headerList: HttpHeaders = this.adminHeaders.append('Authorization', 'Bearer ' + userLogged.token);
    let params = new HttpParams().set("username", dni)

    return this.http.delete(`${this.adminUrl}/deleteResearcher`, {headers: headerList, params: params});
  }

  public registerResearcher(user: User): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));
    if(userLogged === null || userLogged.token === null || userLogged.token === ""){
      return null;
    }

    let headerList: HttpHeaders = this.adminHeaders.append('Authorization', 'Bearer ' + userLogged.token);

    return this.http.post(`${this.adminUrl}/registerResearcher`,user , {headers: headerList});
  }

  public getAllSubjects(): Observable<any> {
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null || userLogged.token === null || userLogged.token === ""){
      return null;
    }

    let headerList: HttpHeaders = this.adminHeaders.append('Authorization', 'Bearer ' + userLogged.token);

    return this.http.get(`${this.adminUrl}/subjects`, {headers: headerList});
  }

  public getSubjectsAndInvestigationsFromIdAdmin(id: string): Observable<any> {
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null || userLogged.token === null || userLogged.token === ""){
      return null;
    }

    let headerList: HttpHeaders = this.adminHeaders.append('Authorization', 'Bearer ' + userLogged.token);

    return this.http.get(`${this.adminUrl}/${id}/subjects`, {headers: headerList});
  }

  public deleteSubjectByIdentificationNumber(identificationNumber: string): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null || userLogged.token === null || userLogged.token === ""){
      return null;
    }
    
    let headerList: HttpHeaders = this.adminHeaders.append('Authorization', 'Bearer ' + userLogged.token);
    let params = new HttpParams().set("identificationNumber", identificationNumber)

    return this.http.delete(`${this.adminUrl}/deleteSubject`, {headers: headerList, params: params});
  }

  public getNumberInvestigationsCompletedFromSubject(identificationNumber: string): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null || userLogged.token === null || userLogged.token === ""){
      return null;
    }
    
    let headerList: HttpHeaders = this.adminHeaders.append('Authorization', 'Bearer ' + userLogged.token);

    return this.http.get(`${this.adminUrl}/investigationsCompletedSubject/${identificationNumber}`, {headers: headerList});
  }

  public getSubjectByIdentificationNumber(identificationNumber: string): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null || userLogged.token === null || userLogged.token === ""){
      return null;
    }
    
    let headerList: HttpHeaders = this.adminHeaders.append('Authorization', 'Bearer ' + userLogged.token);

    return this.http.get(`${this.adminUrl}/subjects/${identificationNumber}`, {headers: headerList});
  }

  public getSubjectsByResearcherDNI(username: string): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null || userLogged.token === null || userLogged.token === ""){
      return null;
    }
    
    let headerList: HttpHeaders = this.adminHeaders.append('Authorization', 'Bearer ' + userLogged.token);
    console.log(`${this.adminUrl}/${username}/subjects`);
    return this.http.get(`${this.adminUrl}/${username}/subject`, {headers: headerList});
  }

  public getResearcherByID(id: string): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));

    if(userLogged === null || userLogged.token === null || userLogged.token === ""){
      return null;
    }
    
    let headerList: HttpHeaders = this.adminHeaders.append('Authorization', 'Bearer ' + userLogged.token);

    return this.http.get(`${this.adminUrl}/researchers/${id}`, {headers: headerList});
  }

  public updateResearcher(user: User): Observable<any>{
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));
    if(userLogged === null || userLogged.token === null || userLogged.token === ""){
      return null;
    }

    let headerList: HttpHeaders = this.adminHeaders.append('Authorization', 'Bearer ' + userLogged.token);

    return this.http.post(`${this.adminUrl}/updateResearcher`,user , {headers: headerList});
  }

  
}
