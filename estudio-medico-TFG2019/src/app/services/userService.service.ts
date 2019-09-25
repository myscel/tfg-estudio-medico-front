import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  username: string = "edu";
  password: string = "encriptasao4";

  userUrl: string = 'http://localhost:8080/api/user';

  userHeaders = new HttpHeaders ({
    'Content-Type': 'application/json',
    'authorization':'Basic ' +  btoa(this.username + ':' +  this.password)
  });

  options = {headers: this.userHeaders}

  constructor(private http: HttpClient) { }


  public createAndStoreUserPostLogin(dni: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.userUrl}/login`, {
      dni: dni,
      password: password
    }, this.options);
  }

  public login(){
    return this.http.get(`${this.userUrl}/login`, this.options);
  }

}
