import { Component, OnInit, Input  } from '@angular/core';
import { Router } from '@angular/router';
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

  invisibleRegisterHidden: boolean = true;

  inputName: string;
  inputSurname: string;
  inputMyDni: string;
  inputPass: string;
  inputPassRepeat: string;

  emptyList: boolean = false;

  passIsChecked: boolean = false;
  passRepeatedIsChecked: boolean = false;

  constructor(private router: Router,
              private adminService: AdminServiceService,
              private formBuilder: FormBuilder,
              private dniInputServiceService: DniInputServiceService,
              private passwordInputService: PasswordInputServiceService,
              private genderInputService: GenderInputServiceService,
              private nameInputService: NameInputServiceService,
              private surnameInputService: SurnameInputServiceService,
              private sortResearchersService: SortResearchersServiceService) { 
  }

  ngOnInit() {
    this.setAInvisibleModal();
    this.resetInputFields();

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
      this.setAlertRegister();
      this.errorMessage = "Rellena todos los campos";
    }
    else if(!this.dniInputServiceService.validateDNI(this.f.dni.value)){
      this.setAlertRegister();
      this.errorMessage = "DNI formato incorrecto";
    }
    else if(!this.passwordInputService.validateLengthPass(this.f.password.value)){
      this.setAlertRegister();
      this.errorMessage = "Las contraseñas deben de tener al menos 5 caracteres";
    }
    else if(!this.passwordInputService.validatePassAndPassRepeat(this.f.password.value, this.f.passwordRepeat.value )){
      this.setAlertRegister();
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
        !this.passwordInputService.validateEmptyField(this.f.password.value) ||   
        !this.passwordInputService.validateEmptyField(this.f.passwordRepeat.value) || 
        !this.nameInputService.validateEmptyField(this.f.name.value) ||
        !this.surnameInputService.validateEmptyField(this.f.lastname.value) ||
        !this.genderInputService.validateEmptyField(this.f.gender.value)
    ){
      return false;
    }
    return true;
  }

  registerResearcher(user: User){
    let observable = this.adminService.registerResearcher(user);

    if(observable === null){
      this.router.navigate(['/login']);
    }
    else{
      observable.subscribe(responseData =>{
        let userRegistered: User = responseData;
        this.researchers.push(userRegistered);
        this.emptyList = false;
        this.setSuccessRegister();
        this.successMessage = "Investigador registrado correctamente"
        this.resetInputFields();
      }, error =>{
        this.setAlertRegister();
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
    this.resetInputFields();

    this.adminService.deleteResearcher(username).subscribe(responseData =>{
      this.setSuccessDelete();
      this.successDeleteMessage = "Investigador con DNI " + username +   " eliminado correctamente";

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
      if(err.status === 404){
        this.alertDeleteMessage = "Investigador con DNI: " + username + " no encontrado.";
      }
      if(err.status === 409){
        this.alertDeleteMessage = "El investigador con DNI: " + username + " tiene pacientes asociados.";
      }
      else{
        this.alertDeleteMessage = "No se ha podido eliminar al Investigador con DNI " + username + ".";
      }
      this.setAlertDelete();
    });
  }
  
  doLogOut(){
    localStorage.removeItem('userLogged');
    this.router.navigate(['/login']);
  }

  sortUpDni(){
    this.sortResearchersService.sortUpDni(this.researchers);
  }

  sortDownDni(){
    this.sortResearchersService.sortDownDni(this.researchers);
  }

  sortUpName(){
    this.sortResearchersService.sortUpName(this.researchers);
  }

  sortDownName(){
    this.sortResearchersService.sortDownName(this.researchers);
  }

  sortUpGender(){
    this.sortResearchersService.sortUpGender(this.researchers);
  }

  sortDownGender(){
    this.sortResearchersService.sortDownGender(this.researchers);
  }

  goToResearcherList(){
    this.router.navigate(['/admin/researchers']);
  }

  goToSubjectList(){
    this.router.navigate(['/admin/subjects']);
  }

  goToInvestigationList(){
    this.router.navigate(['/admin/appointments']);
  }

  goToModifyResearcher(id: string){
    this.router.navigate(['/admin/researchers/edit/' + id]);
  }

  doResearcherView(){
    let user: User = JSON.parse(localStorage.getItem("userLogged"));
    this.router.navigate(['/researcher/' + user.id]);
  }

  changeShowPass(){
    this.passIsChecked = !this.passIsChecked;
  }

  changeRepeatedShowPass(){
    this.passRepeatedIsChecked = !this.passRepeatedIsChecked;
  }

  resetInputFields(){
    this.inputName = "";
    this.inputSurname= "";
    this.inputMyDni= "";
    this.inputPass= "";
    this.inputPassRepeat= "";
  }

  setSuccessDelete(){
    this.successDeleteHidden = true;
    this.alertDeleteHidden = false;
    this.alertRegisterHidden = false;
    this.successRegisterHidden = false;
    this.invisibleRegisterHidden = true;
  }

  setAlertDelete(){
    this.successDeleteHidden = false;
    this.alertDeleteHidden = true;
    this.alertRegisterHidden = false;
    this.successRegisterHidden = false;
    this.invisibleRegisterHidden = true;
  }

  setSuccessRegister(){
    this.successDeleteHidden = false;
    this.alertDeleteHidden = false;
    this.alertRegisterHidden = false;
    this.successRegisterHidden = true;
    this.invisibleRegisterHidden = false;
  }

  setAlertRegister(){
    this.successDeleteHidden = false;
    this.alertDeleteHidden = false;
    this.alertRegisterHidden = true;
    this.successRegisterHidden = false;
    this.invisibleRegisterHidden = false;
  }

  setAInvisibleModal(){
    this.successDeleteHidden = false;
    this.alertDeleteHidden = false;
    this.alertRegisterHidden = false;
    this.successRegisterHidden = false;
    this.invisibleRegisterHidden = true;
  }

}
