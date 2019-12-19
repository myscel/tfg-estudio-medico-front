import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from 'src/app/services/userService.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userLogged: User;

  constructor(private router: Router,
    private http: HttpClient,
    private userService: UserServiceService) { }

  ngOnInit() {
    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));
  }

  doHome(){
    this.router.navigate(['/researcher/' + this.userLogged.id]);
  }

  doProfile(){
    this.router.navigate(['/researcher/profile/' + this.userLogged.id]);
  }

  doLogOut(){
    this.userService.logOutResearcherAndAdmin().subscribe(responseData =>{
      localStorage.removeItem('userLogged');
      this.router.navigate(['/login']);
    });
  }
  
}
