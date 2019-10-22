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

}
