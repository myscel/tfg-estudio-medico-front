import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from 'src/app/services/userService.service';
import { User } from 'src/app/models/User';
import { ResearcherServiceService } from 'src/app/services/researcher-service.service';
import { Component, OnInit, Input  } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin-service.service';

@Component({
  selector: 'app-home-researcher',
  templateUrl: './home-researcher.component.html',
  styleUrls: ['./home-researcher.component.css']
})
export class HomeResearcherComponent implements OnInit {

  @Input() subjects: User[] = [];

  userLogged: User;

  emptyList: boolean = false;

  constructor(private router: Router,
    private http: HttpClient,
     private userService: UserServiceService,
      private researcherService: ResearcherServiceService,
      private adminServiceService: AdminServiceService) { }

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
