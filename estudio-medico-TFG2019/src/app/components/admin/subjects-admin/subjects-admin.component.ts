import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { Subject } from 'src/app/models/Subject';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SortSubjectsServiceService } from 'src/app/services/subject/sort-subjects-service.service';
import { DniInputServiceService } from 'src/app/services/researcher/dni-input-service.service';
import { IdentificationNumberSubjectServiceService } from 'src/app/services/subject/identification-number-subject-service.service';

@Component({
  selector: 'app-subjects-admin',
  templateUrl: './subjects-admin.component.html',
  styleUrls: ['./subjects-admin.component.css']
})
export class SubjectsAdminComponent implements OnInit {

  @Input() subjects: Subject[] = [];
  
  userLogged: User;
  emptyList: boolean = false;
  researcherFilterForm: FormGroup;
  subjectsFilterForm: FormGroup;

  successHidden: boolean = false;
  alertHidden: boolean = false;
  alertWarningHidden: boolean = false;
  alertInvisibleHidden: boolean = true;
  alertFilterHidden: boolean = false;
  successFilterHidden: boolean = false;
  successMessage: string = "";
  alertMessage: string = "";
  alertWarningMessage: string = "";
  alertFilterMessage: string = "";
  successFilterMessage: string = "";
  subjectToDelete: string;

  inputIDSubject: string;
  inputDNIResearcher: string;


  constructor(private router: Router,
    private adminService: AdminServiceService,
    private formBuilder: FormBuilder,
    private sortSubjectsService: SortSubjectsServiceService,
    private dniInputServiceService: DniInputServiceService,
    private identificationNumberSubjectService: IdentificationNumberSubjectServiceService) { }

  ngOnInit() {
    this.checkAdminProfile();
    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));

    this.adminService.getAllSubjects().subscribe(response =>{
      this.subjects = response.list;
      if(this.subjects.length === 0){
        this.emptyList = true;
      }
      else{
        this.emptyList = false;
      }
    }, error =>{
      this.setAlertModal()
      this.alertMessage = "No se pudo cargar la lista de pacientes"
    });

  this.researcherFilterForm = this.formBuilder.group({
    researcherFilterDNI: ['', Validators.required]
  });

  this.subjectsFilterForm = this.formBuilder.group({
    subjectFilterID: ['', Validators.required]
  });
}

  get researcherFilterDataForm() { return this.researcherFilterForm.controls; }
  get subjectsFilterDataForm() { return this.subjectsFilterForm.controls; }

  sortUpIdentificationNumber(){
    this.sortSubjectsService.sortUpIdentificationNumber(this.subjects);
  }

  sortDownIdentificationNumber(){
    this.sortSubjectsService.sortDownIdentificationNumber(this.subjects);
  }

  sortUpDniResearcher(){
    this.sortSubjectsService.sortUpDniResearcher(this.subjects);
  }

  sortDownDniResearcher(){
    this.sortSubjectsService.sortDownDniResearcher(this.subjects);
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

  doLogOut(){
    localStorage.removeItem('userLogged');
    this.router.navigate(['/login']);
  }

  doResearcherView(){
    this.router.navigate(['/researcher/' + this.userLogged.id]);
  }

  deleteSubject(identificationNumber: string){
    let observable = this.adminService.getNumberInvestigationsCompletedFromSubject(identificationNumber);

    if(observable === null){
      this.router.navigate(['/login']);
    }
    else{
      observable.subscribe(response =>{
        let investigationsCompleted: number = response.numberInvestigationsCompleted;
        this.subjectToDelete = identificationNumber;
        if(investigationsCompleted !== 0){
          console.log("EL PACIENTE TIENE " +  investigationsCompleted + " investigacion pendiente");
          window.scroll(0,0);
          this.setWarningDeleteModal()
          this.alertWarningMessage = "El paciente " + identificationNumber + " tiene " + investigationsCompleted + " citas completada(s)";
        }
        else{
         this.confirmDelete();
        }  
      }, error =>{
        this.setAlertModal()

        if(error.status === 500){
          this.alertMessage = "Fallo en el servidor";
        }
        else if(error.status === 400){
          this.alertMessage = "El número de identificación debe ser un número entero";
        }
      });
    }
  }

  confirmDelete(){
      let observable = this.adminService.deleteSubjectByIdentificationNumber(this.subjectToDelete);
      if(observable === null){
        this.router.navigate(['/login']);
      }
      else{
        observable.subscribe(response =>{  
          this.adminService.getAllSubjects().subscribe(response =>{
            this.subjects = response.list;
    
            if(this.subjects.length === 0){
              this.emptyList = true;
            }
            else{
              this.emptyList = false;
            }
          });
          this.setSuccessModal();

          this.successMessage = "Éxito al borrar al paciente: " + this.subjectToDelete;

        }, error =>{
          this.setAlertModal();

          if(error.status === 500){
            this.alertMessage = "Fallo en el servidor";
          }
          else if(error.status === 400){
            this.alertMessage = "El número de identificación debe ser un número entero";
          }
          else if(error.status === 404){
            this.alertMessage = "El paciente no existe";
          }
        });
      }
  }

  cancelDelete(){
    this.successHidden = false;
    this.alertHidden = false;
    this.alertInvisibleHidden = true;
    this.alertWarningHidden = false;
    this.alertFilterHidden = false;
    this.successFilterHidden = false;
  }

  filterSubjectsByIdentificationNumber(){
    this.inputDNIResearcher = "";

    if(!this.identificationNumberSubjectService.validateEmptyField(this.subjectsFilterDataForm.subjectFilterID.value)){
      this.setAlertFilterModal();
      this.alertFilterMessage = "Campo Número Identificación Vacío";
      return;
    }
    if(!this.identificationNumberSubjectService.validateNumberField(this.subjectsFilterDataForm.subjectFilterID.value)){
      this.setAlertFilterModal();
      this.alertFilterMessage = "Introduce un número como identificación del paciente";
      return;
    }
    if(!this.identificationNumberSubjectService.validateIdentificationNumberLenght(this.subjectsFilterDataForm.subjectFilterID.value)){
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
        this.setSuccessFilterModal();
        this.successFilterMessage ="Paciente encontrado!"
        window.scroll(0,0);
        let subject: Subject = response;
        let subjectsAux: Subject[] = [];
        subjectsAux.push(subject);
        this.subjects = subjectsAux;
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

  filterSubjectsByResearcherDNI(){ 
    this.inputIDSubject = "";
    if(!this.dniInputServiceService.validateEmptyField(this.researcherFilterDataForm.researcherFilterDNI.value)){
      this.setAlertFilterModal();
      this.alertFilterMessage = "Campo DNI Vacío";
      return;
    }
    if(! this.dniInputServiceService.validateDNI(this.researcherFilterDataForm.researcherFilterDNI.value.trim())){
      this.setAlertFilterModal();
      this.alertFilterMessage = "Introduce un DNI Válido";
      return;
    }
    let observable = this.adminService.getSubjectsByResearcherDNI(this.researcherFilterDataForm.researcherFilterDNI.value);

    if(observable === null){
      this.router.navigate(['/login']);
    }
    else{
      observable.subscribe(response =>{
        this.setSuccessFilterModal();
        this.successFilterMessage ="Investigador encontrado!"
        window.scroll(0,0);
        this.subjects = response.list;
      }, error =>{
        this.setAlertFilterModal();
        if(error.status === 404){
          this.alertFilterMessage = "El investigador con DNI " + this.researcherFilterDataForm.researcherFilterDNI.value + " no existe";
        }
        else{
          this.alertFilterMessage = "Fallo en el servidor";
        }
      });
    }
  }

  updateListSubjects(){
    this.inputIDSubject = "";
    this.inputDNIResearcher = "";

    let observable = this.adminService.getAllSubjects();

    if(observable === null){
      this.router.navigate(['/login']);
    }
    else{
      observable.subscribe(response =>{
        this.setSuccessModal();
        this.successMessage = "Lista Pacientes actualizada"
        window.scroll(0,0);
        this.subjects = response.list;

        if(this.subjects.length === 0){
          this.emptyList = true;
        }
        else{
          this.emptyList = false;
        }
      }, error =>{     
        this.setAlertModal();
        this.alertMessage = "No se pudo actualizar la lista de pacientes"
      });
    }
  }

  setSuccessModal(){
    this.successHidden = true;
    this.alertInvisibleHidden = false;
    this.alertHidden = false;
    this.alertWarningHidden = false;
    this.alertFilterHidden = false;
    this.successFilterHidden = false;
  }

  setAlertModal(){
    this.successHidden = false;
    this.alertHidden = true;
    this.alertWarningHidden = false;
    this.alertInvisibleHidden = false;
    this.alertFilterHidden = false;
    this.successFilterHidden = false;
  }

  setWarningDeleteModal(){
    this.successHidden = false;
    this.alertHidden = false;
    this.alertWarningHidden = true;
    this.alertInvisibleHidden = false;
    this.alertFilterHidden = false;
    this.successFilterHidden = false;
  }

  setSuccessFilterModal(){
    this.successHidden = false;
    this.alertInvisibleHidden = true;
    this.alertHidden = false;
    this.alertWarningHidden = false;
    this.alertFilterHidden = false;
    this.successFilterHidden = true;
  }

  setAlertFilterModal(){
    this.successHidden = false;
    this.alertHidden = false;
    this.alertWarningHidden = false;
    this.alertInvisibleHidden = true;
    this.alertFilterHidden = true;
    this.successFilterHidden = false;
  }

  checkAdminProfile(){
    if(!this.adminService.checkAdminProfile()){
      this.doLogOut();
    }
  }
}
