import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from 'src/app/services/userService.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  inputDni: string;
  inputPassword: string;
  alertHidden: boolean = false;
  errorMessage: string;
  

  constructor(
    private http: HttpClient, 
    private userService: UserServiceService,
    private formBuilder: FormBuilder,
    private router: Router
    ) {}


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      dni: ['', Validators.required],
      password: ['', Validators.required]
  });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    if(this.f.dni.value === undefined || this.f.dni.value === "" || this.f.password.value === undefined || this.f.password.value === ""){
      this.errorMessage = "Dni y/o contraseña vacíos";
      this.alertHidden = true;
    }
    else{
      this.alertHidden = false;
      this.userToLog.username = this.f.dni.value;
      this.userToLog.password = this.f.password.value;
  
      this.doLogin();
    }
  }


  doLogin(){
    this.userService.loginResearcherAndAdmin(this.userToLog.username, this.userToLog.password).subscribe(responseData =>{
      console.log("Todo ha ido bien");
      
      this.userService.userLogged = responseData;
      console.log(this.userService.userLogged);

      localStorage.setItem("userLogged", JSON.stringify(this.userService.userLogged));

      if(this.userService.userLogged.role === "ADMIN"){
        this.router.navigate(['/admin']);
      }

      else{
        this.router.navigate(['/researcher']);
      }
    }, err => {
      console.log(err)
      if(err.status === 401){
        this.errorMessage = "Usuario o contraseña incorrectos";
      }
      else{
        this.errorMessage = "Algo ha ido mal";
      } 
      this.inputDni = "";
      this.inputPassword = "";
      this.alertHidden = true;
    });
  }
}
