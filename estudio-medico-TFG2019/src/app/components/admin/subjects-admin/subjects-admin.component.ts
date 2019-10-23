import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/services/userService.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/User';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { Subject } from 'src/app/models/Subject';

@Component({
  selector: 'app-subjects-admin',
  templateUrl: './subjects-admin.component.html',
  styleUrls: ['./subjects-admin.component.css']
})
export class SubjectsAdminComponent implements OnInit {

  @Input() subjects: Subject[] = [];
  
  userLogged: User;
  emptyList: boolean = false;

  successDeleteHidden: boolean = false;
  alertDeleteHidden: boolean = false;
  alertWarningHidden: boolean = false;
  alertInvisibleHidden: boolean = true;
  successDeleteMessage: string = "";
  alertDeleteMessage: string = "";
  alertWarningMessage: string = "";
  subjectToDelete: string;

  constructor(private router: Router,
    private http: HttpClient,
    private userService: UserServiceService,
    private adminService: AdminServiceService) { }

  ngOnInit() {
    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));

    let observable = this.adminService.getAllSubjects();

    if(observable === null){
      this.router.navigate(['/login']);
    }

    else{
      observable.subscribe(response =>{

        console.log("Éxito al listar los pacientes");

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
        console.log("Error al listar pacientes");
        console.log(error);
        this.router.navigate(['/login']);
      });
    }
  }

  sortUpIdentificationNumber(){
    this.subjects = this.subjects.sort(function (a, b) {
      if (a.identificationNumber > b.identificationNumber) {
        return 1;
      }
      if (a.identificationNumber < b.identificationNumber) {
        return -1;
      }
      return 0;
    });
  }

  sortDownIdentificationNumber(){
    this.subjects = this.subjects.sort(function (a, b) {
      if (a.identificationNumber < b.identificationNumber) {
        return 1;
      }
      if (a.identificationNumber > b.identificationNumber) {
        return -1;
      }
      return 0;
    });
  }

  sortUpDniResearcher(){
    this.subjects = this.subjects.sort(function (a, b) {
      if (a.usernameResearcher.toUpperCase() > b.usernameResearcher.toUpperCase()) {
        return 1;
      }
      if (a.usernameResearcher.toUpperCase() < b.usernameResearcher.toUpperCase()) {
        return -1;
      }
      return 0;
    });
  }

  sortDownDniResearcher(){
    this.subjects = this.subjects.sort(function (a, b) {
      if (a.usernameResearcher.toUpperCase() < b.usernameResearcher.toUpperCase()) {
        return 1;
      }
      if (a.usernameResearcher.toUpperCase() > b.usernameResearcher.toUpperCase()) {
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

  deleteSubject(identificationNumber: string){
    console.log("Vamos a borrar al paciente: " + identificationNumber);

    let observable = this.adminService.getNumberInvestigationsCompletedFromSubject(identificationNumber);

    if(observable === null){
      this.router.navigate(['/login']);
    }

    else{
      observable.subscribe(response =>{

        let investigationsCompleted: number = response.numberInvestigationsCompleted;

        console.log("El paciente " + identificationNumber + " tiene " + investigationsCompleted + " citas completada(s)");

        if(investigationsCompleted !== 0){

          window.scroll(0,0);

          this.successDeleteHidden = false;
          this.alertDeleteHidden = false;
          this.alertWarningHidden = true;
          this.alertInvisibleHidden = false;

          this.alertWarningMessage = "El paciente " + identificationNumber + " tiene " + investigationsCompleted + " citas completada(s)";
          this.subjectToDelete = identificationNumber;
        }

        else{
          let observable = this.adminService.deleteSubjectByIdentificationNumber(identificationNumber);

          if(observable === null){
            this.router.navigate(['/login']);
          }
      
          else{
            observable.subscribe(response =>{
      
              console.log("Éxito al borrar al paciente: " + identificationNumber);
      
              window.scroll(0,0);
      
              this.adminService.getAllSubjects().subscribe(response =>{
                this.subjects = response.list;
        
                if(this.subjects.length === 0){
                  this.emptyList = true;
                }
                else{
                  this.emptyList = false;
                }
              });
      
              this.successDeleteHidden = true;
              this.alertInvisibleHidden = false;
              this.alertDeleteHidden = false;
              this.alertWarningHidden = false;

              this.successDeleteMessage = "Éxito al borrar al paciente: " + identificationNumber;

            }, error =>{
              this.alertWarningHidden = false;
              this.successDeleteHidden = false;
              this.alertDeleteHidden = true;
              this.alertInvisibleHidden = false;
      
              if(error.status === 500){
                this.alertDeleteMessage = "Fallo en el servidor";
              }
              else if(error.status === 400){
                this.alertDeleteMessage = "El número de identificación debe ser un número entero";
              }
              else if(error.status === 404){
                this.alertDeleteMessage = "El paciente no existe";
              }
      
      
              console.log("Error al borrar al paciente: " + identificationNumber);
              console.log(error);
            });
          }
        }

      }, error =>{
        this.successDeleteHidden = false;
        this.alertDeleteHidden = true;
        this.alertInvisibleHidden = false;
        this.alertWarningHidden = false;

        if(error.status === 500){
          this.alertDeleteMessage = "Fallo en el servidor";
        }
        else if(error.status === 400){
          this.alertDeleteMessage = "El número de identificación debe ser un número entero";
        }
        console.log(error);
      });
    }
  }


  confirmDelete(){
    console.log("Vamos a borrar al paciente con citas: " + this.subjectToDelete);
      let observable = this.adminService.deleteSubjectByIdentificationNumber(this.subjectToDelete);

      if(observable === null){
        this.router.navigate(['/login']);
      }
  
      else{
        observable.subscribe(response =>{
          console.log("Éxito al borrar al paciente: " + this.subjectToDelete +  " y sus citas");
  
          this.adminService.getAllSubjects().subscribe(response =>{
            this.subjects = response.list;
    
            if(this.subjects.length === 0){
              this.emptyList = true;
            }
            else{
              this.emptyList = false;
            }
          });
  
          this.successDeleteHidden = true;
          this.alertInvisibleHidden = false;
          this.alertDeleteHidden = false;
          this.alertWarningHidden = false;

          this.successDeleteMessage = "Éxito al borrar al paciente: " + this.subjectToDelete;

        }, error =>{
          this.alertWarningHidden = false;
          this.successDeleteHidden = false;
          this.alertDeleteHidden = true;
          this.alertInvisibleHidden = false;
  
          if(error.status === 500){
            this.alertDeleteMessage = "Fallo en el servidor";
          }
          else if(error.status === 400){
            this.alertDeleteMessage = "El número de identificación debe ser un número entero";
          }
          else if(error.status === 404){
            this.alertDeleteMessage = "El paciente no existe";
          }
  
  
          console.log("Error al borrar al paciente: " + this.subjectToDelete);
          console.log(error);
        });
      }
  }
  

}
