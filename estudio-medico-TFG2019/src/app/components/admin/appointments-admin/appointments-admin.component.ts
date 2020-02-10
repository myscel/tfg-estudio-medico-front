import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { Appointment } from 'src/app/models/Appointment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentificationNumberSubjectServiceService } from 'src/app/services/subject/identification-number-subject-service.service';
import { SortSubjectsServiceService } from 'src/app/services/subject/sort-subjects-service.service';
import { SortAppointmentsServiceService } from 'src/app/services/appointment/sort-appointments-service.service';

@Component({
  selector: 'app-appointments-admin',
  templateUrl: './appointments-admin.component.html',
  styleUrls: ['./appointments-admin.component.css']
})
export class AppointmentsAdminComponent implements OnInit {

  @Input() appointments: Appointment[] = [];


  userLogged: User;

  subjectsFilterForm: FormGroup;
  emptyList: boolean = false;
  alertFilterHidden: boolean = false;
  alertFilterMessage: string = "";
  alertInvisibleHidden: boolean = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private identificationNumberSubjectServiceService: IdentificationNumberSubjectServiceService,
    private adminService: AdminServiceService,
    private sortAppointmentsService: SortAppointmentsServiceService) { }

  ngOnInit() {
    this.checkAdminProfile();
    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));

    this.adminService.getAllCompletedAppointments().subscribe(response =>{
      this.appointments = response.list;

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

  get subjectsFilterDataForm() { return this.subjectsFilterForm.controls; }

  doLogOut(){
    localStorage.removeItem('userLogged');
    this.router.navigate(['/login']);
  }

  doResearcherView(){
    this.router.navigate(['/researcher/' + this.userLogged.id]);
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

  goToModifyAppointment(investigationsDetailsId: string, subjectIdentificationNumber: string){
    this.router.navigate(['/admin/modifyAppointment/' + subjectIdentificationNumber + '/' + investigationsDetailsId ]);
  }

  filterSubjectsByIdentificationNumber(){

    if(!this.identificationNumberSubjectServiceService.validateEmptyField(this.subjectsFilterDataForm.subjectFilterID.value)){
      this.setAlertFilterModal();
      this.alertFilterMessage = "Campo Número Identificación Vacío";
      return;
    }

    if(isNaN(this.subjectsFilterDataForm.subjectFilterID.value.trim())){
      this.setAlertFilterModal();
      this.alertFilterMessage = "Introduce un número como identificación del paciente";
      return;
    }

    if(!this.identificationNumberSubjectServiceService.validateIdentificationNumberLenght(this.subjectsFilterDataForm.subjectFilterID.value)){
      this.setAlertFilterModal();
      this.alertFilterMessage = "El número de identificación debe tener 8 dígitos";
      return;
    }

    let observable = this.adminService.getSubjectByIdentificationNumber(this.subjectsFilterDataForm.subjectFilterID.value.trim());

    if(observable === null){
      this.router.navigate(['/login']);
    }

    else{
      observable.subscribe(response =>{
        this.cancelDelete();

        window.scroll(0,0);

        let appointment: Appointment = response;

        let appointmentsAux: Appointment[] = [];
        appointmentsAux.push(appointment);

        this.appointments = appointmentsAux;

        if(this.appointments.length === 0){
          this.emptyList = true;
        }
        else{
          this.emptyList = false;
        }
      }, error =>{
        this.setAlertFilterModal();

        if(error.status === 400){
          this.alertFilterMessage = "Introduce un número";
        }
        else if(error.status === 404){
          this.alertFilterMessage = "El paciente con identificación " + this.subjectsFilterDataForm.subjectFilterID.value + " no existe";
        }
        else{
          this.alertFilterMessage = "Fallo en el servidor";
        }
      });
    }
  }

  setAlertFilterModal(){
    this.alertInvisibleHidden = true;
    this.alertFilterHidden = true;
  }

  cancelDelete(){
    this.alertInvisibleHidden = true;
    this.alertFilterHidden = false;
  }

  sortUpIdentificationNumber(){
    this.sortAppointmentsService.sortDownIdentificationNumber(this.appointments);
  }

  sortDownIdentificationNumber(){
    this.sortAppointmentsService.sortDownIdentificationNumber(this.appointments);
  }

  checkAdminProfile(){
    if(!this.adminService.checkAdminProfile()){
      this.doLogOut();
    }
  }
}
