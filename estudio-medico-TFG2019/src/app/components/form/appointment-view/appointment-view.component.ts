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


      //TEMP
      var month1 = this.appointment.birthDate.getUTCMonth() + 1; //months from 1-12
      var day1 = this.appointment.birthDate.getUTCDate();
      var year1 = this.appointment.birthDate.getUTCFullYear();
      console.log("FECHA: " + day1 + "-" + month1 + "-" +  year1);


      this.appointment.investigationDate = new Date(this.appointment.investigationDate);
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
