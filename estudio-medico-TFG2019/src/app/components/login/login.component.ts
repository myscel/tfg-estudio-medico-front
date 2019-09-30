import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from 'src/app/services/userService.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { unwrapResolvedMetadata, IfStmt } from '@angular/compiler';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userToLog: User = new User();
  loginForm: FormGroup;
  selectedOption: string;
    options = [
      { name: "Administrador", value: 1 },
      { name: "Investigador", value: 2 }
    ]

  constructor(
    private http: HttpClient, 
    private userService: UserServiceService,
    private formBuilder: FormBuilder,
    private router: Router
    ) {}


  ngOnInit() {
    this.selectedOption = this.options[0].name;

    this.loginForm = this.formBuilder.group({
      dni: ['', Validators.required],
      password: ['', Validators.required]
  });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.userToLog.dni = this.f.dni.value;
    this.userToLog.password = this.f.password.value;

    if(this.selectedOption == this.options[0].name){
      //Login Admin
    }
    else{
      //Login investigador
      this.doLoginResearcher();
    }
  }

  doLoginAdmin(){
    /*
     return this.userService.login().subscribe(responseData =>{
      console.log("Todo ha ido bien");
      console.log(responseData)
    }, err => {
      console.log("Algo ha fallado");
      console.log(err)
    });
     */
   
  }

  doLoginResearcher(){
    return this.userService.loginResearcher(this.userToLog.dni, this.userToLog.password).subscribe(responseData =>{
      console.log("Todo ha ido bien");
      console.log(responseData);
      localStorage.setItem('userLogged', JSON.stringify(responseData));
      this.router.navigate(['/researcher']);

    }, err => {
      //Pacheco haz el Modal de error de login :D

      console.log("Algo ha fallado");
      console.log(err)
      if(err.status === 401){
        console.log("Error: usuario o contraseña incorrectos");
      }
      else{
        console.log("Error Desconocido");
      } 
    });
  }

}
