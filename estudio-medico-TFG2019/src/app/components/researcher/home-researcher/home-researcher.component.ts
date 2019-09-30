import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from 'src/app/services/userService.service';

@Component({
  selector: 'app-home-researcher',
  templateUrl: './home-researcher.component.html',
  styleUrls: ['./home-researcher.component.css']
})
export class HomeResearcherComponent implements OnInit {

  constructor(private router: Router,private http: HttpClient, private userService: UserServiceService) { }

  ngOnInit() {
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
