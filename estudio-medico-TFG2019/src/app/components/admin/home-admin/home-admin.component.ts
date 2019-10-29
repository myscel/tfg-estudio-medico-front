import { Component, OnInit, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from 'src/app/services/userService.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { User } from 'src/app/models/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css'
]
})
export class HomeAdminComponent implements OnInit {

  @Input() researchers: User[] = [];


  userLogged: User;
  registerForm: FormGroup;
  alertRegisterHidden: boolean = false;
  successRegisterHidden: boolean = false;
  errorMessage: string;
  successMessage: string;


  successDeleteHidden: boolean = false;
  successDeleteMessage: string;

  alertDeleteHidden: boolean = false;
  alertDeleteMessage: string;

  inputName: string;
  inputSurname: string;
  inputMyDni: string;
  inputPass: string;
  inputPassRepeat: string;

  emptyList: boolean = false;

  constructor(private router: Router,
              private http: HttpClient,
              private userService: UserServiceService,
              private adminService: AdminServiceService,
              private formBuilder: FormBuilder) { 
  }


  ngOnInit() {

    this.alertRegisterHidden = false;
    this.inputName = "";
    this.inputSurname= "";
    this.inputMyDni= "";
    this.inputPass= "";
    this.inputPassRepeat= "";

    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));

    let observable = this.adminService.getAllResearchers();

    if(observable === null){
      this.router.navigate(['/login']);
    }

    else{
      observable.subscribe(response =>{


        this.researchers = response.list;

        if(this.researchers.length === 0){
          this.emptyList = true;
        }
        else{
          this.emptyList = false;
        }


      }, error =>{
        this.router.navigate(['/login']);
      });
    }

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      dni: ['', Validators.required],
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required],
      gender: ['', Validators.required]
  });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    if(!this.checkEmptyFields()){
      this.alertRegisterHidden = true;
      this.successRegisterHidden = false;
      this.errorMessage = "Rellena todos los campos";
    }
    else if(this.f.password.value.trim() !== this.f.passwordRepeat.value.trim() ){
      this.alertRegisterHidden = true;
      this.successRegisterHidden = false;
      this.errorMessage = "Las contraseñas no coinciden";
    }
    else if(!this.validateDNI(this.f.dni.value)){
      this.alertRegisterHidden = true;
      this.successRegisterHidden = false;
      this.errorMessage = "DNI formato incorrecto";
    }
    else{
      var userInfo: User = new User();
      userInfo.username = this.f.dni.value;
      userInfo.password = this.f.password.value;
      userInfo.name = this.f.name.value.toUpperCase();
      userInfo.surname = this.f.lastname.value.toUpperCase();
      userInfo.gender = this.f.gender.value;
  
      this.registerResearcher(userInfo);
    }
  }

  checkEmptyFields(): boolean{
    if(this.f.dni.value.trim() === "" || 
      this.f.password.value.trim() === "" ||
      this.f.passwordRepeat.value.trim() === "" ||
      this.f.name.value.trim() === "" ||
      this.f.lastname.value.trim() === "" ||
      this.f.gender.value.trim() === ""){
      return false;
    }
    return true;
  }

  validateDNI(dni: string): boolean {
    var regExpresion = /^[0-9]{8,8}[A-Za-z]$/;
    //Check length and format
    if(dni.length !== 9 || !regExpresion.test(dni)){
      return false;
    }
    return true;
  }

  registerResearcher(user: User){
      
    this.alertRegisterHidden = false;

    let observable = this.adminService.registerResearcher(user);

    if(observable === null){
      this.router.navigate(['/login']);
    }
    else{
      observable.subscribe(responseData =>{
        let userRegistered: User = responseData;
        this.researchers.push(userRegistered);

        this.emptyList = false;
        this.alertRegisterHidden = false;
        this.successRegisterHidden = true;
        this.successMessage = "Investigador registrado correctamente"

        this.inputName = "";
        this.inputSurname= "";
        this.inputMyDni= "";
        this.inputPass= "";
        this.inputPassRepeat= "";

      }, error =>{
        this.alertRegisterHidden = true;
        this.successRegisterHidden = false;
        if(error.status === 409){
          this.errorMessage = "Ya existe un usuario con el mismo dni";
        }
        else{
          this.errorMessage = "Fallo en el servidor";
        } 
      });
    }
  }

  deleteResearcher(username: string){

    this.alertRegisterHidden = false;
    this.successRegisterHidden = false;
    this.inputName = "";
    this.inputSurname= "";
    this.inputMyDni= "";
    this.inputPass= "";
    this.inputPassRepeat= "";

    this.adminService.deleteResearcher(username).subscribe(responseData =>{

      this.successDeleteHidden = true;
      this.successDeleteMessage = "Investigador con DNI " + username +   " eliminado correctamente";

      setTimeout( () =>{
        this.successDeleteHidden = false;
      }, 3000);
      
      this.adminService.getAllResearchers().subscribe(response =>{
        this.researchers = response.list;

        if(this.researchers.length === 0){
          this.emptyList = true;
        }
        else{
          this.emptyList = false;
        }
      });
      
    }, err => {

      if(err.status === 409){
        this.alertDeleteMessage = "El investigador con DNI: " + username + " tiene pacientes asociados.";

      }
      else{
        this.alertDeleteMessage = "No se ha podido eliminar al Investigador con DNI " + username + ".";
      }
      this.alertDeleteHidden = true;

      setTimeout( () =>{
        this.alertDeleteHidden = false;
      }, 5000);
    });
  }

  doLogOut(){
    this.userService.logOutResearcherAndAdmin().subscribe(responseData =>{
      localStorage.removeItem('userLogged');
      this.router.navigate(['/login']);

    });
  }

  sortUpDni(){
    this.researchers = this.researchers.sort(function (a, b) {
      if (a.username.toUpperCase() > b.username.toUpperCase()) {
        return 1;
      }
      if (a.username.toUpperCase() < b.username.toUpperCase()) {
        return -1;
      }
      return 0;
    });
  }

  sortDownDni(){
    this.researchers = this.researchers.sort(function (a, b) {
      if (a.username.toUpperCase() < b.username.toUpperCase()) {
        return 1;
      }
      if (a.username.toUpperCase() > b.username.toUpperCase()) {
        return -1;
      }
      return 0;
    });
  }

  sortUpName(){
    this.researchers = this.researchers.sort(function (a, b) {
      if (a.name.toUpperCase() > b.name.toUpperCase()) {
        return 1;
      }
      if (a.name.toUpperCase() < b.name.toUpperCase()) {
        return -1;
      }
      return 0;
    });
  }

  sortDownName(){
    this.researchers = this.researchers.sort(function (a, b) {
      if (a.name.toUpperCase() < b.name.toUpperCase()) {
        return 1;
      }
      if (a.name.toUpperCase() > b.name.toUpperCase()) {
        return -1;
      }
      return 0;
    });
  }

  sortUpGender(){
    this.researchers = this.researchers.sort(function (a, b) {
      if (a.gender.toUpperCase() > b.gender.toUpperCase()) {
        return 1;
      }
      if (a.gender.toUpperCase() < b.gender.toUpperCase()) {
        return -1;
      }
      return 0;
    });
  }

  sortDownGender(){
    this.researchers = this.researchers.sort(function (a, b) {
      if (a.gender.toUpperCase() < b.gender.toUpperCase()) {
        return 1;
      }
      if (a.gender.toUpperCase() > b.gender.toUpperCase()) {
        return -1;
      }
      return 0;
    });
  }

  goToResearcherList(){
    this.router.navigate(['/admin/researchers']);

  }

  goToSubjectList(){
    this.router.navigate(['/admin/subjects']);
  }

  modifyResearcher(id: string){
    this.router.navigate(['/admin/researchers/edit/' + id]);
  }

}
