import { Component, OnInit, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from 'src/app/services/userService.service';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { User } from 'src/app/models/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DniInputServiceService } from 'src/app/services/researcher/dni-input-service.service';
import { PasswordInputServiceService } from 'src/app/services/researcher/password-input-service.service';
import { GenderInputServiceService } from 'src/app/services/researcher/gender-input-service.service';
import { NameInputServiceService } from 'src/app/services/researcher/name-input-service.service';
import { SurnameInputServiceService } from 'src/app/services/researcher/surname-input-service.service';
import { SortResearchersServiceService } from 'src/app/services/researcher/sort-researchers-service.service';

@Component({
  selector: 'app-researchers-admin',
  templateUrl: './researchers-admin.component.html',
  styleUrls: ['./researchers-admin.component.css'
]
})
export class ResearchersAdminComponent implements OnInit {

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
              private formBuilder: FormBuilder,
              private dniInputServiceService: DniInputServiceService,
              private passwordInputServiceService: PasswordInputServiceService,
              private genderInputServiceService: GenderInputServiceService,
              private nameInputServiceService: NameInputServiceService,
              private surnameInputServiceService: SurnameInputServiceService,
              private sortResearchersServiceService: SortResearchersServiceService) { 
  }


  ngOnInit() {

    this.alertRegisterHidden = false;
    this.inputName = "";
    this.inputSurname= "";
    this.inputMyDni= "";
    this.inputPass= "";
    this.inputPassRepeat= "";

    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));


    this.adminService.getAllResearchers().subscribe(response =>{
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
    else if(!this.dniInputServiceService.validateDNI(this.f.dni.value)){
      this.alertRegisterHidden = true;
      this.successRegisterHidden = false;
      this.errorMessage = "DNI formato incorrecto";
    }
    else if(!this.passwordInputServiceService.validateLengthPass(this.f.password.value)){
      this.alertRegisterHidden = true;
      this.successRegisterHidden = false;
      this.errorMessage = "Las contraseñas deben de tener al menos 5 caracteres";
    }
    else if(!this.passwordInputServiceService.validatePassAndPassRepeat(this.f.password.value, this.f.passwordRepeat.value )){
      this.alertRegisterHidden = true;
      this.successRegisterHidden = false;
      this.errorMessage = "Las contraseñas no coinciden";
    }
    else{
      var userInfo: User = new User();
      userInfo.username = this.f.dni.value.toUpperCase();
      userInfo.password = this.f.password.value;
      userInfo.name = this.f.name.value.toUpperCase();
      userInfo.surname = this.f.lastname.value.toUpperCase();
      userInfo.gender = this.f.gender.value;
  
      this.registerResearcher(userInfo);
    }
  }

  checkEmptyFields(): boolean{
    if(!this.dniInputServiceService.validateEmptyField(this.f.dni.value) || 
        !this.passwordInputServiceService.validateEmptyField(this.f.password.value) ||   
        !this.passwordInputServiceService.validateEmptyField(this.f.passwordRepeat.value) || 
        !this.nameInputServiceService.validateEmptyField(this.f.name.value) ||
        !this.surnameInputServiceService.validateEmptyField(this.f.lastname.value) ||
        !this.genderInputServiceService.validateEmptyField(this.f.gender.value)
    ){
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
    localStorage.removeItem('userLogged');
    this.router.navigate(['/login']);
  }

  sortUpDni(){
    this.sortResearchersServiceService.sortUpDni(this.researchers);
  }

  sortDownDni(){
    this.sortResearchersServiceService.sortDownDni(this.researchers);
  }

  sortUpName(){
    this.sortResearchersServiceService.sortUpName(this.researchers);
  }

  sortDownName(){
    this.sortResearchersServiceService.sortDownName(this.researchers);
  }

  sortUpGender(){
    this.sortResearchersServiceService.sortUpGender(this.researchers);
  }

  sortDownGender(){
    this.sortResearchersServiceService.sortDownGender(this.researchers);
  }

  goToResearcherList(){
    this.router.navigate(['/admin/researchers']);
  }

  goToSubjectList(){
    this.router.navigate(['/admin/subjects']);
  }

  goToModifyResearcher(id: string){
    this.router.navigate(['/admin/researchers/edit/' + id]);
  }

  doResearcherView(){
    this.router.navigate(['/researcher/' + this.userService.userLogged.id]);
  }

}
