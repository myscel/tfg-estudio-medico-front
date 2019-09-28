import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from 'src/app/services/userService.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  dni: string = "47298046H";
  password: string = "pass1";
  loginForm: FormGroup;
  selectedOption: string;
    options = [
      { name: "Administrador", value: 1 },
      { name: "Investigador", value: 2 }
    ]

  constructor(
    private http: HttpClient, 
    private userService: UserServiceService,
    private formBuilder: FormBuilder,) {}


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      dni: ['', Validators.required],
      password: ['', Validators.required]
  });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.dni = this.f.dni.value;
    this.password = this.f.password.value;
    this.enviarPeticion();
  }

  enviarPeticion(){
    return this.userService.createAndStoreUserPostLogin(this.dni, this.password).subscribe(responseData =>{
      console.log("Todo ha ido bien");
      console.log(responseData)
    }, err => {
      console.log("Algo ha fallado");
      console.log(err)
    });
  }

  enviarPeticion2(){
    return this.userService.login().subscribe(responseData =>{
      console.log("Todo ha ido bien");
      console.log(responseData)
    }, err => {
      console.log("Algo ha fallado");
      console.log(err)
    });
  }

}
