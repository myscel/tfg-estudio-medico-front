import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  userUrl: string = 'http://localhost:8080/user';

  userHeaders = new HttpHeaders ({
    'Content-Type': 'application/json'
  });

  options = {headers: this.userHeaders}

  constructor(private http: HttpClient) { }


  public createAndStoreUserPostLogin(dni: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.userUrl}/login`, {
      dni: dni,
      password: password
    }, this.options);
  }

}
