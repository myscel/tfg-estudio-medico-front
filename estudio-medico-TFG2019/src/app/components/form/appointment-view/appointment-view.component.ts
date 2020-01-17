import { Component, OnInit } from '@angular/core';
import { UserServiceService } from 'src/app/services/userService.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/User';
import { ResearcherServiceService } from 'src/app/services/researcher/researcher-service.service';
import { Appointment } from 'src/app/models/Appointment';

@Component({
  selector: 'app-appointment-view',
  templateUrl: './appointment-view.component.html',
  styleUrls: ['./appointment-view.component.css']
})
export class AppointmentViewComponent implements OnInit {

  userLogged: User;

  appointment: Appointment;
  identificationNumber: number;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserServiceService,
    private researcherService: ResearcherServiceService
  ) { 
  }

  ngOnInit() {
    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));
    this.appointment = new Appointment();

    let idSubject = this.activatedRoute.snapshot.params.idSubject;
    let numberInvestigation = this.activatedRoute.snapshot.params.appointment;

    this.researcherService.getAppointmentDetails(idSubject, numberInvestigation).subscribe(responseData =>{
      this.appointment = responseData;
      this.identificationNumber = responseData.identificationNumber;

    }, error =>{
      this.doLogOut();
    });
  }

  doLogOut(){
    localStorage.removeItem('userLogged');
    this.router.navigate(['/login']);
  }

  doProfile() {
    this.router.navigate(['/researcher/profile/' + this.userLogged.id]);
  }

  doHome() {
    this.router.navigate(['/researcher/' + this.userLogged.id]);
  }

}
