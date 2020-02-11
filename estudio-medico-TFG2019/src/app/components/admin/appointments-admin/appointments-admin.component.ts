import { Component, OnInit, Input, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { Appointment } from 'src/app/models/Appointment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentificationNumberSubjectServiceService } from 'src/app/services/subject/identification-number-subject-service.service';
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
  successFilterHidden: boolean = false;
  successFilterMessage: string = "";

  successHidden: boolean = false;
  successMessage: string = "Lista de citas cargada correctamente.";
  alertHidden: boolean = false;
  alertMessage: string = "Fallo al cargar la lista de citas";
  alertInvisibleHidden: boolean = true;

  inputID: string;
  

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

  refreshAppointmentList(){
    this.inputID = "";
    this.adminService.getAllCompletedAppointments().subscribe(response =>{
      this.setSuccessListModal();
      this.appointments = response.list;

      if(this.appointments.length === 0){
        this.emptyList = true;
      }
      else{
        this.emptyList = false;
      }
    }, error =>{
      this.setAlertListModal();
    });
  }

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
    let observable = this.adminService.getAllCompletedAppointmentsByIdentificationNumber(this.subjectsFilterDataForm.subjectFilterID.value.trim());

    if(observable === null){
      this.router.navigate(['/login']);
    }
    else{
      observable.subscribe(response =>{
        this.successFilterMessage = "Paciente encontrado!";
        this.setSuccessFilterModal();
        window.scroll(0,0);
        this.appointments = response.list;
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
    this.alertFilterHidden = true;
    this.successFilterHidden = false;

    this.successHidden = false;
    this.alertHidden = false;
    this.alertInvisibleHidden = true;
  }

  setSuccessFilterModal(){
    this.alertFilterHidden = false;
    this.successFilterHidden = true;

    this.successHidden = false;
    this.alertHidden = false;
    this.alertInvisibleHidden = true;
  }

  setSuccessListModal(){
    this.alertFilterHidden = false;
    this.successFilterHidden = false;

    this.successHidden = true;
    this.alertHidden = false;
    this.alertInvisibleHidden = false;
  }

  setAlertListModal(){
    this.alertFilterHidden = false;
    this.successFilterHidden = false;

    this.successHidden = false;
    this.alertHidden = true;
    this.alertInvisibleHidden = false;
  }

  sortUpIdentificationNumber(){
    this.sortAppointmentsService.sortUpIdentificationNumber(this.appointments);
  }

  sortDownIdentificationNumber(){
    this.sortAppointmentsService.sortDownIdentificationNumber(this.appointments);
  }

  sortUpNumberInvestigation(){
    this.sortAppointmentsService.sortUpNumberInvestigation(this.appointments);
  }

  sortDownNumberInvestigation(){
    this.sortAppointmentsService.sortDownNumberInvestigation(this.appointments);
  }

  checkAdminProfile(){
    if(!this.adminService.checkAdminProfile()){
      this.doLogOut();
    }
  }
}
