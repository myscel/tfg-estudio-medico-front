import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../models/User';
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

  
}
