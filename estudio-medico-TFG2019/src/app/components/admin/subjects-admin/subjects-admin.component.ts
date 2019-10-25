import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/services/userService.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/User';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { Subject } from 'src/app/models/Subject';
import { TouchSequence } from 'selenium-webdriver';

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
  alertFilterHidden: boolean = false;
  successDeleteMessage: string = "";
  alertDeleteMessage: string = "";
  alertWarningMessage: string = "";
  alertFilterMessage: string = "";
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
        this.subjects = response.list;

        if(this.subjects.length === 0){
          this.emptyList = true;
        }
        else{
          this.emptyList = false;
        }
      }, error =>{
        this.successDeleteHidden = false;
        this.alertDeleteMessage = "No se pudo cargar la lista de pacientes"
        this.alertDeleteHidden = true;
        this.alertWarningHidden = false;
        this.alertInvisibleHidden = false;
        this.alertFilterHidden = false;
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
      localStorage.removeItem('userLogged');
      this.router.navigate(['/login']);

    });
  }

  deleteSubject(identificationNumber: string){

    let observable = this.adminService.getNumberInvestigationsCompletedFromSubject(identificationNumber);

    if(observable === null){
      this.router.navigate(['/login']);
    }

    else{
      observable.subscribe(response =>{

        let investigationsCompleted: number = response.numberInvestigationsCompleted;

        if(investigationsCompleted !== 0){

          window.scroll(0,0);

          this.successDeleteHidden = false;
          this.alertDeleteHidden = false;
          this.alertWarningHidden = true;
          this.alertInvisibleHidden = false;
          this.alertFilterHidden = false;

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
              this.alertFilterHidden = false;

              this.successDeleteMessage = "Éxito al borrar al paciente: " + identificationNumber;

            }, error =>{
              this.alertWarningHidden = false;
              this.successDeleteHidden = false;
              this.alertDeleteHidden = true;
              this.alertInvisibleHidden = false;
              this.alertFilterHidden = false;
      
              if(error.status === 500){
                this.alertDeleteMessage = "Fallo en el servidor";
              }
              else if(error.status === 400){
                this.alertDeleteMessage = "El número de identificación debe ser un número entero";
              }
              else if(error.status === 404){
                this.alertDeleteMessage = "El paciente no existe";
              }
            });
          }
        }

      }, error =>{
        this.successDeleteHidden = false;
        this.alertDeleteHidden = true;
        this.alertInvisibleHidden = false;
        this.alertWarningHidden = false;
        this.alertFilterHidden = false;

        if(error.status === 500){
          this.alertDeleteMessage = "Fallo en el servidor";
        }
        else if(error.status === 400){
          this.alertDeleteMessage = "El número de identificación debe ser un número entero";
        }
      });
    }
  }


  confirmDelete(){
      let observable = this.adminService.deleteSubjectByIdentificationNumber(this.subjectToDelete);

      if(observable === null){
        this.router.navigate(['/login']);
      }
  
      else{
        observable.subscribe(response =>{  
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
          this.alertFilterHidden = false;


          this.successDeleteMessage = "Éxito al borrar al paciente: " + this.subjectToDelete;

        }, error =>{
          this.alertWarningHidden = false;
          this.successDeleteHidden = false;
          this.alertDeleteHidden = true;
          this.alertInvisibleHidden = false;
          this.alertFilterHidden = false;

  
          if(error.status === 500){
            this.alertDeleteMessage = "Fallo en el servidor";
          }
          else if(error.status === 400){
            this.alertDeleteMessage = "El número de identificación debe ser un número entero";
          }
          else if(error.status === 404){
            this.alertDeleteMessage = "El paciente no existe";
          }
        });
      }
  }

  cancelDelete(){
    this.successDeleteHidden = false;
    this.alertDeleteHidden = false;
    this.alertInvisibleHidden = true;
    this.alertWarningHidden = false;
    this.alertFilterHidden = false;
  }

  filterSubjectsByIdentificationNumber(identificationNumber: string){
    let observable = this.adminService.getSubjectByIdentificationNumber(identificationNumber);

    if(observable === null){
      this.router.navigate(['/login']);
    }

    else{
      observable.subscribe(response =>{
        this.successDeleteHidden = false;
        this.alertDeleteHidden = false;
        this.alertWarningHidden = false;
        this.alertInvisibleHidden = true;
        this.alertFilterHidden = false;

        window.scroll(0,0);

        let subject: Subject = response;

        let subjectsAux: Subject[] = [];
        subjectsAux.push(subject);

        this.subjects = subjectsAux;

        if(this.subjects.length === 0){
          this.emptyList = true;
        }
        else{
          this.emptyList = false;
        }
      }, error =>{
        this.successDeleteHidden = false;
        this.alertDeleteHidden = false;
        this.alertWarningHidden = false;
        this.alertInvisibleHidden = true;
        this.alertFilterHidden = true;

        if(error.status === 400){
          this.alertFilterMessage = "Introduce un número";
        }
        else if(error.status === 404){
          this.alertFilterMessage = "El paciente solicitado no existe";
        }
        else{
          this.alertFilterMessage = "Fallo en el servidor";
        }
      });
    }
  }

  filterSubjectsByResearcherDNI(username: string){
    let observable = this.adminService.getSubjectsByResearcherDNI(username);

    if(observable === null){
      this.router.navigate(['/login']);
    }

    else{
      observable.subscribe(response =>{
        this.successDeleteHidden = false;
        this.alertDeleteHidden = false;
        this.alertWarningHidden = false;
        this.alertInvisibleHidden = true;
        this.alertFilterHidden = false;

        window.scroll(0,0);

        this.subjects = response.list;

        if(this.subjects.length === 0){
          this.emptyList = true;
        }
        else{
          this.emptyList = false;
        }
      }, error =>{
        this.successDeleteHidden = false;
        this.alertDeleteHidden = false;
        this.alertWarningHidden = false;
        this.alertInvisibleHidden = true;
        this.alertFilterHidden = true;

        if(error.status === 404){
          this.alertFilterMessage = "El investigador solicitado no existe";
        }
        else{
          this.alertFilterMessage = "Fallo en el servidor";
        }
      });
    }
  }

  updateListSubjects(){
    let observable = this.adminService.getAllSubjects();

    if(observable === null){
      this.router.navigate(['/login']);
    }

    else{
      observable.subscribe(response =>{

        this.successDeleteHidden = true;
        this.successDeleteMessage = "Lista Pacientes actualizada"
        this.alertDeleteHidden = false;
        this.alertWarningHidden = false;
        this.alertInvisibleHidden = false;
        this.alertFilterHidden = false;

        window.scroll(0,0);

        this.subjects = response.list;

        if(this.subjects.length === 0){
          this.emptyList = true;
        }
        else{
          this.emptyList = false;
        }
      }, error =>{     
        this.successDeleteHidden = false;
        this.successDeleteMessage = "No se pudo actualizar la lista de pacientes"
        this.alertDeleteHidden = true;
        this.alertWarningHidden = false;
        this.alertInvisibleHidden = false;
        this.alertFilterHidden = false;
      });
    }
  }
  

}
