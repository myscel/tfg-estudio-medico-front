import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from 'src/app/services/userService.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent implements OnInit {

  constructor(private router: Router,
              private http: HttpClient,
              private userService: UserServiceService,
              private adminService: AdminServiceService) { 
  }

  ngOnInit() {
    let observable = this.adminService.getAllResearchers();

    if(observable === null){
      this.router.navigate(['/login']);
    }

    else{
      observable.subscribe(response =>{
        console.log("Éxito al listar usuarios");
        console.log(response);
        //Mapear los usuarios
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
