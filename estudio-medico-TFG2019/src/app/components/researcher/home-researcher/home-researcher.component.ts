import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from 'src/app/services/userService.service';
import { User } from 'src/app/models/User';
import { Subject } from 'src/app/models/Subject';
import { ResearcherServiceService } from 'src/app/services/researcher/researcher-service.service';
import { Component, OnInit, Input  } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentificationNumberSubjectServiceService } from 'src/app/services/subject/identification-number-subject-service.service';

@Component({
  selector: 'app-home-researcher',
  templateUrl: './home-researcher.component.html',
  styleUrls: ['./home-researcher.component.css']
})
export class HomeResearcherComponent implements OnInit {

  @Input() subjects: User[] = [];

  userLogged: User;
  newSubjectForm: FormGroup;

  emptyList: boolean = false;

  successHidden: boolean = false;
  alertHidden: boolean = false;
  alertInvisibleHidden: boolean = true;
  alertFilterHidden: boolean;
  successMessage: string = "";
  alertMessage: string = "";


  constructor(private router: Router,
    private http: HttpClient,
     private userService: UserServiceService,
      private researcherService: ResearcherServiceService,
      private adminServiceService: AdminServiceService,
      private identificationNumberSubjectServiceService: IdentificationNumberSubjectServiceService,
      private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));

    let observable = null;
    
    if(this.userLogged.role === "ADMIN"){
      console.log("ACCEDIENDO DESDE ADMIN...");
      observable = this.adminServiceService.getSubjectsAndInvestigationsFromIdAdmin(this.userLogged.id);
    }
    else{
      console.log("ACCEDIENDO DESDE RESEARCHER...");
      observable = this.researcherService.getSubjectsAndInvestigationsFromIdResearcher(this.userLogged.id);
    }

    if(observable === null){
      this.router.navigate(['/login']);
    }

    else{
      observable.subscribe(response =>{
        this.subjects = response.list;
        if(this.subjects.length === 0){
          this.emptyList = true;
        }
        else{
          this.emptyList = false;
        }


      }, error =>{
        this.router.navigate(['/login']);
      });
    }

    this.newSubjectForm = this.formBuilder.group({
      identificationNumber: ['', Validators.required]
  });
  }

  get f() { return this.newSubjectForm.controls; }

  doLogOut(){
    this.userService.logOutResearcherAndAdmin().subscribe(responseData =>{
      localStorage.removeItem('userLogged');
      this.router.navigate(['/login']);
    });
  }

  doNewForm(idSubject: string, appointment: string){
    this.router.navigate(['/researcher/' + this.userLogged.id + '/subjectForm/' + idSubject + "/" + appointment]);
  }

  doProfile(){
    this.router.navigate(['/researcher/profile/' + this.userLogged.id]);
  }

  doHome(){
    console.log("Vamos a pacientes");
    this.router.navigate(['/researcher/' + this.userLogged.id]);
  }

  registerSubject(){

    if(!this.identificationNumberSubjectServiceService.validateEmptyField(this.f.identificationNumber.value)){
      this.alertMessage = "Número de identificación vacío";
      this.setAlertDeleteModal();
    }

    else if(!this.identificationNumberSubjectServiceService.validateNumberField(this.f.identificationNumber.value)){
      this.alertMessage = "No es un número";
      this.setAlertDeleteModal();
    }

    else if(!this.identificationNumberSubjectServiceService.validateIdentificationNumberLenght(this.f.identificationNumber.value)){
      this.alertMessage = "No es un número de 8 caracteres";
      this.setAlertDeleteModal();
    }

    else{
      var subjectInfo: Subject = new Subject();
      subjectInfo.identificationNumber = this.f.identificationNumber.value;
      subjectInfo.usernameResearcher = this.userLogged.username;
      let observable = this.researcherService.registerSubject(subjectInfo);
    
      if(observable === null){
        this.router.navigate(['/login']);
      }
      else{
        observable.subscribe(responseData =>{
          var subjectCreated: Subject = responseData;
          this.successMessage = "Paciente con Nº" + subjectCreated.identificationNumber + " registrado correctamente";
          this.setSuccessDeleteModal();
          this.ngOnInit();
        }, error =>{
          if(error.status === 409){
            console.log("Error, el paciente ya existe");
          }
          else if(error.status === 410){
            console.log("Error, el investigador ya no existe");
          }
          else if(error.status === 410){
            console.log("Error en el servidor");
          }
        });
      }
    }


    
  }

  setSuccessDeleteModal(){
    this.successHidden = true;
    this.alertInvisibleHidden = false;
    this.alertHidden = false;
  }

  setAlertDeleteModal(){
    this.successHidden = false;
    this.alertHidden = true;
    this.alertInvisibleHidden = false;
  }

  setInvisibleDeleteModal(){
    this.successHidden = false;
    this.alertHidden = false;
    this.alertInvisibleHidden = true;
  }
}
