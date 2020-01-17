import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  userUrl: string = 'http://localhost:8080/api/user';
  userLogged: User;

  userHeaders = new HttpHeaders ({
    'Content-Type': 'application/json'
  });

  options = {headers: this.userHeaders}

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.userLogged = null;
  }

  public loginResearcherAndAdmin(username: string, password: string): Observable<any> {
    let headerLogin: HttpHeaders = this.userHeaders.append('Authorization', 'Basic ' +  btoa(username + ':' + password));


    let user: User = new User();
    user.username = username;
    user.password = password;
    console.log(user);
    return this.http.post(`${this.userUrl}/login`, user, {headers: headerLogin})

  }

  public logOutResearcherAndAdmin(): Observable<any> {
    return this.http.post(`${this.userUrl}/logout`, {});
  }

}