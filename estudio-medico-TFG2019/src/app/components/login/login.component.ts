import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from 'src/app/services/userService.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';
import { PasswordInputServiceService } from 'src/app/services/password-input-service.service';
import { DniInputServiceService } from 'src/app/services/researcher/dni-input-service.service';



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
    private router: Router,
    private passwordInputServiceService: PasswordInputServiceService,
    private dniInputServiceService: DniInputServiceService
    ) {}


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      dni: ['', Validators.required],
      password: ['', Validators.required]
  });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.alertHidden = false;

    if(!this.passwordInputServiceService.validateEmptyField(this.f.password.value) ||
       !this.dniInputServiceService.validateEmptyField(this.f.dni.value)){
      this.errorMessage = "Dni y/o contraseña vacíos";
      this.alertHidden = true;
      this.inputDni = "";
      this.inputPassword = "";
    }

 
    else{
      if(!this.dniInputServiceService.validateDNI(this.f.dni.value)){
        this.errorMessage = "DNI formato incorrecto";
        this.alertHidden = true;
        this.inputDni = "";
        this.inputPassword = "";
      }
      else if(!this.passwordInputServiceService.validateLengthPass(this.f.password.value)){
        this.errorMessage = "La contraseña debe tener al menos 5 caracteres";
        this.alertHidden = true;
        this.inputDni = "";
        this.inputPassword = "";
      }
      else{
        this.alertHidden = false;
        this.userToLog.username = this.f.dni.value;
        this.userToLog.password = this.f.password.value;
    
        this.doLogin();
      }
    }
  }


  doLogin(){
    this.userService.loginResearcherAndAdmin(this.userToLog.username, this.userToLog.password).subscribe(responseData =>{
      
      this.userService.userLogged = responseData;

      localStorage.setItem("userLogged", JSON.stringify(this.userService.userLogged));

      if(this.userService.userLogged.role === "ADMIN"){
        this.router.navigate(['/admin/researchers']);
      }
      else{
        this.router.navigate(['/researcher']);
      }
    }, err => {
      console.log(err.status);

      if(err.status === 500){
        this.errorMessage = "Fallo en el servidor";
      }
      else{
        this.errorMessage = "Usuario o contraseña incorrectos";
      } 
      this.inputDni = "";
      this.inputPassword = "";
      this.alertHidden = true;
    });
  }
}
