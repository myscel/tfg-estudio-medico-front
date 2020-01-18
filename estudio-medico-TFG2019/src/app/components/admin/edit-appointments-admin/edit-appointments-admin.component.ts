import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { HttpClient } from '@angular/common/http';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { Appointment } from 'src/app/models/Appointment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-appointments-admin',
  templateUrl: './edit-appointments-admin.component.html',
  styleUrls: ['./edit-appointments-admin.component.css']
})
export class EditAppointmentsAdminComponent implements OnInit {

  @Input() appointments: Appointment[] = [];


  userLogged: User;

  subjectsFilterForm: FormGroup;
  emptyList: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private adminService: AdminServiceService,) { }

  ngOnInit() {

    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));

    
    this.adminService.getAllCompletedAppointments().subscribe(response =>{
      this.appointments = response.list;
      console.log(this.appointments);

      if(this.appointments.length === 0){
        this.emptyList = true;
      }
      else{
        this.emptyList = false;
      }
    }, error =>{
      this.router.navigate(['/login']);
    });

    this.subjectsFilterForm = this.formBuilder.group({
      subjectFilterID: ['', Validators.required]
    });
    
  }

  goToResearcherList(){
    this.router.navigate(['/admin/researchers']);
  }

  goToSubjectList(){
    this.router.navigate(['/admin/subjects']);
  }

  goToInvestigationList(){
    this.router.navigate(['/admin/appointments']);
  }
}
