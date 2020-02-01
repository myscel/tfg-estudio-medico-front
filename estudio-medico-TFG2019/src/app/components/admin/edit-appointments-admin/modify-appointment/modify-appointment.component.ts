import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/User';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { Appointment } from 'src/app/models/Appointment';

@Component({
  selector: 'app-modify-appointment',
  templateUrl: './modify-appointment.component.html',
  styleUrls: ['./modify-appointment.component.css']
})
export class ModifyAppointmentComponent implements OnInit {

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
    private adminService: AdminServiceService,
    private route: ActivatedRoute,
  ) { 
  }

  ngOnInit() {
    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));
    this.appointment = new Appointment();

    let investigationsDetailsId = this.activatedRoute.snapshot.params.investigationsDetailsId;
    this.identificationNumber = this.activatedRoute.snapshot.params.subjectIdentificationNumber

    this.adminService.getAppointmentDetails(investigationsDetailsId).subscribe(responseData =>{

      this.appointment = responseData;

      this.appointment.birthDate = new Date(this.appointment.birthDate);
      this.birthMonth = this.appointment.birthDate.getUTCMonth() + 1; //months from 1-12
      this.birthDay = this.appointment.birthDate.getUTCDate();
      this.birthYear = this.appointment.birthDate.getUTCFullYear();


      this.appointment.investigationDate = new Date(this.appointment.investigationDate);
      this.investigationMonth = this.appointment.investigationDate.getUTCMonth() + 1; //months from 1-12
      this.investigationDay = this.appointment.investigationDate.getUTCDate();
      this.investigationYear = this.appointment.investigationDate.getUTCFullYear();

    }, error =>{
      this.doLogOut();
    });
  }

  
  doLogOut(){
    debugger;
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
