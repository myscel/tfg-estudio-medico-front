import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page-admin-comp',
  templateUrl: './main-page-admin-comp.component.html',
  styleUrls: ['./main-page-admin-comp.component.css']
})
export class MainPageAdminCompComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  logoutAdmin(){
    this.router.navigate([`login`]);
  }

}
