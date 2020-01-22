import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { User } from 'src/app/models/User';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordInputServiceService } from 'src/app/services/researcher/password-input-service.service';

@Component({
  selector: 'app-edit-researcher-admin',
  templateUrl: './edit-researcher-admin.component.html',
  styleUrls: ['./edit-researcher-admin.component.css']
})
export class EditResearcherAdminComponent implements OnInit {

  @Input() researcher: User = new User();
  userLogged: User;
  id: string;
  passIsChecked: boolean = false;
  passRepeatIsChecked: boolean = false;
  alertModifyHidden:boolean = false;
  successModifyHidden:boolean = false;
  errorMessage:string = "";
  successMessage:string = "";
  updateForm: FormGroup;
  researcherFound: boolean = true;

  constructor(private router: Router,
    private adminService: AdminServiceService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private passwordInputService: PasswordInputServiceService) { }

  ngOnInit() {
    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));
    this.id = this.route.snapshot.paramMap.get('id');

    this.adminService.getResearcherByID(this.id).subscribe(response =>{
      this.researcher = response;
    }, error =>{
      this.setAlertModify();
      this.researcherFound = false;
      
      if(error.status === 404){
        this.errorMessage= "El investigador no existe";
      }
      else if(error.status === 500){
        this.errorMessage= "Fallo en el servidor";
      }
    });
    
    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      password: ['', Validators.required],
      repeatedPassword: ['', Validators.required]
  }); 
  }

  get updateFields() { return this.updateForm.controls; }

  changeShowPass(){
    this.passIsChecked = !this.passIsChecked;
  }

  changeShowPassRepeat(){
    this.passRepeatIsChecked = !this.passRepeatIsChecked;
  }

  leaveUpdateResearcher(){
    this.router.navigate(['/admin/researchers']);
  }

  doLogOut(){
    localStorage.removeItem('userLogged');
    this.router.navigate(['/login']);
  }

  doResearcherView(){
    this.router.navigate(['/researcher/' + this.userLogged.id]);
  }

  doUpdate(){
    if(!this.passwordInputService.validatePassAndPassRepeat(
      this.updateFields.password.value.trim(),
      this.updateFields.repeatedPassword.value.trim()
    )
    ){
      this.setAlertModify();
      this.errorMessage= "Las contraseñas no coinciden";
      return;
    }
    if(this.updateFields.name.value.toUpperCase().trim() == "" &&
      this.updateFields.surname.value.toUpperCase().trim() == "" &&
      !this.passwordInputService.validateEmptyField(this.updateFields.password.value.trim()) &&
      !this.passwordInputService.validateEmptyField(this.updateFields.repeatedPassword.value.trim())
    ){
      this.setAlertModify();
      this.errorMessage= "No has modificado ningún campo";
      return;
    }
    if(
      this.updateFields.name.value.toUpperCase().trim() === this.researcher.name.trim() &&
      this.updateFields.surname.value.toUpperCase().trim() === this.researcher.surname.trim() &&
      !this.passwordInputService.validateEmptyField(this.updateFields.password.value.trim()) &&
      !this.passwordInputService.validateEmptyField(this.updateFields.repeatedPassword.value.trim())
    ){
        this.setAlertModify();
        this.errorMessage= "No has modificado ningún campo";
        return;
    }

    let userToUpdate: User = new User();
    userToUpdate.name = this.updateFields.name.value.toUpperCase().trim()
    if(userToUpdate.name === ""){
      userToUpdate.name = this.researcher.name;
    }
    userToUpdate.surname = this.updateFields.surname.value.toUpperCase().trim();
    if(userToUpdate.surname === ""){
      userToUpdate.surname = this.researcher.surname;
    }
    userToUpdate.password = this.updateFields.password.value.trim();
    userToUpdate.id = this.id;

    let observable = this.adminService.updateResearcher(userToUpdate);
    if(observable === null){
      this.router.navigate(['/login']);
    }
    else{
      observable.subscribe(responseData =>{
        this.setSuccessModify()
        this.researcher = responseData;
        this.successMessage = "Usuario modificado con éxito";
      }, error =>{
        this.setAlertModify();
        if(error.status === 404){
          this.errorMessage = "Usario no encontrado";
        }
        if(error.status === 400){
          this.errorMessage = "Id no válido";
        }
        else{
          this.errorMessage = "Fallo en el servidor";
        } 
      });
    }
  }

  setAlertModify(){
    this.alertModifyHidden = true;
    this.successModifyHidden = false;
  }

  setSuccessModify(){
    this.alertModifyHidden = false;
    this.successModifyHidden = true;
  }
}
