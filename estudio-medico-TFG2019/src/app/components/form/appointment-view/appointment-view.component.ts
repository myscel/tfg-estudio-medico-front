import { Component, OnInit } from '@angular/core';
import { UserServiceService } from 'src/app/services/userService.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-appointment-view',
  templateUrl: './appointment-view.component.html',
  styleUrls: ['./appointment-view.component.css']
})
export class AppointmentViewComponent implements OnInit {

  userLogged: User;

  constructor(
    private router: Router,
    private userService: UserServiceService
  ) { }

  ngOnInit() {

    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));

  }

  doLogOut(){
    this.userService.logOutResearcherAndAdmin().subscribe(responseData =>{
      localStorage.removeItem('userLogged');
      this.router.navigate(['/login']);
    });
  }

  doProfile(){
    this.router.navigate(['/researcher/profile/' + this.userLogged.id]);
  }

  doHome(){
    this.router.navigate(['/researcher/' + this.userLogged.id]);
  }

}
