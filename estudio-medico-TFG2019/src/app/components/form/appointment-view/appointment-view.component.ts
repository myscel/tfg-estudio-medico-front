import { Component, OnInit } from '@angular/core';
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

  investigationDay: number;
  investigationMonth: number;
  investigationYear: number;

  birthDay: number;
  birthMonth: number;
  birthYear: number;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private researcherService: ResearcherServiceService,
    private route: ActivatedRoute,
  ) { 
  }

  ngOnInit() {
    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));
    this. checkUserLogged();
    this.appointment = new Appointment();

    let idSubject = this.activatedRoute.snapshot.params.idSubject;
    let numberInvestigation = this.activatedRoute.snapshot.params.appointment;

    this.researcherService.getAppointmentDetails(idSubject, numberInvestigation).subscribe(responseData =>{
      this.appointment = responseData;

      this.appointment.birthDate = new Date(this.appointment.birthDate);
      this.birthMonth = this.appointment.birthDate.getUTCMonth() + 1; //months from 1-12
      this.birthDay = this.appointment.birthDate.getUTCDate();
      this.birthYear = this.appointment.birthDate.getUTCFullYear();


      this.appointment.investigationDate = new Date(this.appointment.investigationDate);
      this.investigationMonth = this.appointment.investigationDate.getUTCMonth() + 1; //months from 1-12
      this.investigationDay = this.appointment.investigationDate.getUTCDate();
      this.investigationYear = this.appointment.investigationDate.getUTCFullYear();

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

  checkUserLogged(){
    let id = this.route.snapshot.paramMap.get('id');

    if(id != this.userLogged.id){
      this.doLogOut();
    }
  }
}
