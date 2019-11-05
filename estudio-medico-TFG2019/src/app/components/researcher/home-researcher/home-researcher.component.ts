import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from 'src/app/services/userService.service';
import { User } from 'src/app/models/User';
import { Subject } from 'src/app/models/Subject';
import { ResearcherServiceService } from 'src/app/services/researcher/researcher-service.service';
import { Component, OnInit, Input  } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
      private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));

    console.log("ID del investigador solicitado: " + this.userLogged.id);
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
    if(this.f.identificationNumber.value.typeOf != undefined){
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
          console.log("chachi");
        }, error =>{
          console.log("nada de chachi");
        });
      }
    }
  }
}
