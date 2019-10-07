import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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


    console.log("Usuario sacado del localStorage: ");
    console.log(userLogged);

    if(userLogged === null || userLogged.token === null || userLogged.token === ""){
      return null;
    }
    

    let headerList: HttpHeaders = this.adminHeaders.append('Authorization', 'Bearer ' + userLogged.token);

    return this.http.get(`${this.adminUrl}/users`, {headers: headerList});
  }
}
