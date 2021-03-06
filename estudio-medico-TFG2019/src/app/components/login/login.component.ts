import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from 'src/app/services/userService.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';
import { PasswordInputServiceService } from 'src/app/services/researcher/password-input-service.service';
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
    private passwordInputService: PasswordInputServiceService,
    private dniInputService: DniInputServiceService
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

    if(!this.passwordInputService.validateEmptyField(this.f.password.value) ||
       !this.dniInputService.validateEmptyField(this.f.dni.value)){
      this.errorMessage = "DNI/NIE y/o contraseña vacíos";
      this.alertHidden = true;
      this.inputDni = "";
      this.inputPassword = "";
    }

 
    else{
      if(!this.dniInputService.validateDNI(this.f.dni.value) && !this.dniInputService.validateNIE(this.f.dni.value)){
        this.errorMessage = "DNI/NIE formato incorrecto";
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
    let user: User = new User();
    user.username = this.userToLog.username;
    user.password = this.userToLog.password;

    this.userService.loginResearcherAndAdmin(user).subscribe(responseData =>{
      
      this.userService.userLogged = responseData;

      localStorage.setItem("userLogged", JSON.stringify(this.userService.userLogged));

      if(this.userService.userLogged.role === "ADMIN"){
        this.router.navigate(['/admin/researchers']);
      }
      else{
        this.router.navigate(['/researcher/' + this.userService.userLogged.id]);
      }
    }, err => {
      if(err.status === 409){
        this.errorMessage = "Usuario o contraseña incorrectos";
      }
      else{
        this.errorMessage = "Fallo en el servidor";
      } 
      this.inputDni = "";
      this.inputPassword = "";
      this.alertHidden = true;
    });
  }
}
