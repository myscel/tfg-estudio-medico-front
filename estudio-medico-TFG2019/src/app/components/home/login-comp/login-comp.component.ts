import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-comp',
  templateUrl: './login-comp.component.html',
  styleUrls: ['./login-comp.component.css']
})
export class LoginCompComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  loginUser(){
    this.router.navigate([`researcher`]);
  }

  loginAdmin(){
    this.router.navigate([`admin`]);
  }

}
