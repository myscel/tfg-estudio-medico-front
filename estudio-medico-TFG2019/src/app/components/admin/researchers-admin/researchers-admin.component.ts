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
  @Input() admins: User[] = [];

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
              private dniInputService: DniInputServiceService,
              private passwordInputService: PasswordInputServiceService,
              private genderInputService: GenderInputServiceService,
              private nameInputService: NameInputServiceService,
              private surnameInputService: SurnameInputServiceService,
              private sortResearchersService: SortResearchersServiceService) { 
  }

  ngOnInit() {
    this.checkAdminProfile();

    this.setInvisibleModal();
    this.resetInputFields();

    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));
    
    this.adminService.getAllResearchers().subscribe(response =>{
      this.researchers = response.listResearchers;
      this.admins = response.listAdmins;

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
    if(!this.checkNameField()){
      this.setAlertRegister();
      this.errorMessage = "Campo Nombre vacío";
    }
    else if(!this.checkLastNameField()){
      this.setAlertRegister();
      this.errorMessage = "Campo Apellidos vacío";
    }
    else if(!this.checkDNIField()){
      this.setAlertRegister();
      this.errorMessage = "Campo DNI/NIE vacío";
    }
    else if(!this.checkPasswordField()){
      this.setAlertRegister();
      this.errorMessage = "Campo Contraseña vacío";
    }
    else if(!this.checkPasswordRepeatField()){
      this.setAlertRegister();
      this.errorMessage = "Campo Confirmar Contraseña vacío";
    }
    else if(!this.checkGenderField()){
      this.setAlertRegister();
      this.errorMessage = "Campo Género vacío";
    }
    else if(!this.dniInputService.validateDNI(this.f.dni.value) && !this.dniInputService.validateNIE(this.f.dni.value)){
      this.setAlertRegister();
      this.errorMessage = "Formatos válidos DNI:11111111X NIE: X1111111Y";
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

  checkNameField(): boolean{
    return this.nameInputService.validateEmptyField(this.f.name.value);
  }

  checkLastNameField(): boolean{
    return this.surnameInputService.validateEmptyField(this.f.lastname.value);
  }

  checkDNIField(): boolean{
    return this.dniInputService.validateEmptyField(this.f.dni.value);
  }

  checkPasswordField(): boolean{
    return this.passwordInputService.validateEmptyField(this.f.password.value);
  }

  checkPasswordRepeatField(): boolean{
    return this.passwordInputService.validateEmptyField(this.f.passwordRepeat.value);
  }

  checkGenderField(): boolean{
    return this.genderInputService.validateEmptyField(this.f.gender.value);
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
          this.errorMessage = "Ya existe un usuario con el mismo DNI/NIE";
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
      this.successDeleteMessage = "Investigador con DNI/NIE " + username +   " eliminado correctamente";

      this.adminService.getAllResearchers().subscribe(response =>{
        this.researchers = response.listResearchers;

        if(this.researchers.length === 0){
          this.emptyList = true;
        }
        else{
          this.emptyList = false;
        }
      });
    }, err => {
      if(err.status === 404){
        this.alertDeleteMessage = "Investigador con DNI/NIE: " + username + " no encontrado.";
      }
      if(err.status === 409){
        this.alertDeleteMessage = "El investigador con DNI/NIE: " + username + " tiene pacientes asociados.";
      }
      else{
        this.alertDeleteMessage = "No se ha podido eliminar al Investigador con DNI/NIE " + username + ".";
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
    this.router.navigate(['/researcher/' + this.userLogged.id]);
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

  setInvisibleModal(){
    this.successDeleteHidden = false;
    this.alertDeleteHidden = false;
    this.alertRegisterHidden = false;
    this.successRegisterHidden = false;
    this.invisibleRegisterHidden = true;
  }

  checkAdminProfile(){
    if(!this.adminService.checkAdminProfile()){
      this.doLogOut();
    }
  }

}
