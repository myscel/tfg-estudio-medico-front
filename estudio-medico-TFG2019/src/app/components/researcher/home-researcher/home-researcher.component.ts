import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from 'src/app/services/userService.service';
import { User } from 'src/app/models/User';
import { AdminServiceService } from 'src/app/services/admin-service.service';

@Component({
  selector: 'app-home-researcher',
  templateUrl: './home-researcher.component.html',
  styleUrls: ['./home-researcher.component.css']
})
export class HomeResearcherComponent implements OnInit {

  userLogged: User;

  constructor(private router: Router,private http: HttpClient, private userService: UserServiceService, private adminService: AdminServiceService,) { }

  ngOnInit() {

    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));

    let observable = this.adminService.getAllResearchers();

    if(observable === null){
      this.router.navigate(['/login']);
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
