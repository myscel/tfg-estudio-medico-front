import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { User } from 'src/app/models/User';
import { UserServiceService } from 'src/app/services/userService.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordInputServiceService } from 'src/app/services/researcher/password-input-service.service';
import { NameInputServiceService } from 'src/app/services/researcher/name-input-service.service';
import { SurnameInputServiceService } from 'src/app/services/researcher/surname-input-service.service';

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
    private http: HttpClient,
    private adminService: AdminServiceService,
    private userService: UserServiceService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private passwordInputServiceService: PasswordInputServiceService,
    private nameInputServiceService: NameInputServiceService,
    private surnameInputServiceService: SurnameInputServiceService,
    private adminServiceService: AdminServiceService) { }

  ngOnInit() {
    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));

    this.id = this.route.snapshot.paramMap.get('id');


    this.adminService.getResearcherByID(this.id).subscribe(response =>{
      this.researcher = response;
    }, error =>{
      this.alertModifyHidden= true;
      this.successModifyHidden = false;
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
    this.userService.logOutResearcherAndAdmin().subscribe(responseData =>{
      localStorage.removeItem('userLogged');
      this.router.navigate(['/login']);
    });
  }

  doUpdate(){
    if(!this.passwordInputServiceService.validatePassAndPassRepeat(
      this.updateFields.password.value,
      this.updateFields.repeatedPassword.value
    )
    ){
      this.alertModifyHidden= true;
      this.successModifyHidden = false;
      this.errorMessage= "Las contraseñas no coinciden";
      return;
    }

    if(this.updateFields.name.value.toUpperCase().trim() == "" &&
      this.updateFields.surname.value.toUpperCase().trim() == "" &&
      !this.passwordInputServiceService.validateEmptyField(this.updateFields.password.value) &&
      !this.passwordInputServiceService.validateEmptyField(this.updateFields.repeatedPassword.value)
    ){
      this.alertModifyHidden= true;
      this.successModifyHidden = false;
      this.errorMessage= "No has modificado ningún campo";
      return;
    }

    if(
      this.updateFields.name.value.toUpperCase() === this.researcher.name &&
      this.updateFields.surname.value.toUpperCase() === this.researcher.surname &&
      !this.passwordInputServiceService.validateEmptyField(this.updateFields.password.value) &&
      !this.passwordInputServiceService.validateEmptyField(this.updateFields.repeatedPassword.value)
    ){
        this.alertModifyHidden= true;
        this.successModifyHidden = false;
        this.errorMessage= "No has modificado ningún campo";
        return;
    }

    let userToUpdate: User = new User();

    userToUpdate.name = this.updateFields.name.value.toUpperCase().trim()
    userToUpdate.surname = this.updateFields.surname.value.toUpperCase().trim();
    userToUpdate.password = this.updateFields.password.value.trim();
    userToUpdate.id = this.id;

    let observable = this.adminService.updateResearcher(userToUpdate);

    if(observable === null){
      this.router.navigate(['/login']);
    }
    else{
      observable.subscribe(responseData =>{
        this.alertModifyHidden = false;
        this.successModifyHidden = true;
        this.researcher = responseData;
        this.successMessage = "Usuario modificado con éxito";

      }, error =>{
        this.alertModifyHidden = true;
        this.successModifyHidden = false;

        if(error.status === 404){
          this.errorMessage = "Usario no encontrado";
        }
        else{
          this.errorMessage = "Fallo en el servidor";
        } 
      });
    }



  }

}
