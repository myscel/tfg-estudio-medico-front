import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http: HttpClient) { }


  createAndStoreUserPostLogin(dni: string, password: string){
    this.http.post('', {});
  }

  loginUser(){

  }
}
