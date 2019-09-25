import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  userUrl: string = 'http://localhost:8080/api/user';

  userHeaders = new HttpHeaders ({
    'Content-Type': 'application/json'
    /*'Authorization':'Basic ' +  btoa(this.username + ':' +  this.password)*/
  });

  options = {headers: this.userHeaders}

  constructor(private http: HttpClient) { }


  public login(username: string, password: string): Observable<any> {
    let headerLogin: HttpHeaders = this.userHeaders.append('Authorization', 'Basic ' +  btoa(username + ':' + password));

    return this.http.get<any>(`${this.userUrl}/login`, {headers: headerLogin});
  }

}
