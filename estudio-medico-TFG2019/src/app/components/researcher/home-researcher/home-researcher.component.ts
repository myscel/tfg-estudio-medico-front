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
        console.log(this.subjects);
        if(this.subjects.length === 0){
          this.emptyList = true;
        }
        else{
          this.emptyList = false;
        }


      }, error =>{
        //Debería mostrar un pop-up
        console.log("Error al listar usuarios");
        console.log(error);
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
      console.log("Iniciando Log out");
      console.log(responseData);
      localStorage.removeItem('userLogged');
      this.router.navigate(['/login']);

    }, err => {
      console.log("Error en el logout");
      console.log(err);
 
    });
  }

  doNewForm(idSubject: string, appointment: string){
    this.router.navigate(['/researcher/subjectForm/' + idSubject + "/" + appointment]);
  }

  doProfile(){
    this.router.navigate(['/researcher/profile/' + this.userLogged.id]);
  }

  doHome(){
    this.router.navigate(['/researcher']);
  }

  registerSubject(){

    if(!this.identificationNumberSubjectServiceService.validateEmptyField(this.f.identificationNumber.value)){
      console.log("Error, número de identificación vacío");
    }

    else if(!this.identificationNumberSubjectServiceService.validateNumberField(this.f.identificationNumber.value)){
      console.log("Error, no es un número");
    }

    else if(!this.identificationNumberSubjectServiceService.validateIdentificationNumberLenght(this.f.identificationNumber.value)){
      console.log("Error, deben ser 8 caracteres");
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
          let subjectRegistered: User = responseData;
          console.log("chachi, paciente creado");
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
}
