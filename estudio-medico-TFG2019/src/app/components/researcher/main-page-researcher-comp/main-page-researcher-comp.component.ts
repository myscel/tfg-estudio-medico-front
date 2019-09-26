import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page-researcher-comp',
  templateUrl: './main-page-researcher-comp.component.html',
  styleUrls: ['./main-page-researcher-comp.component.css']
})
export class MainPageResearcherCompComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  logoutResearcher(){
    this.router.navigate([`login`]);
  }

  reload(){
    this.router.navigate([`researcher`]);
  }

}
