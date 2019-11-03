import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../models/User';
import { Subject } from '../models/Subject';
import {Observable} from 'rxjs';


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

    return this.http.post(`${this.researcherHeaders}/registerSubject`, subject , {headers: headerList});
  }

  
}
