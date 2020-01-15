import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from 'src/app/services/userService.service';
import { User } from 'src/app/models/User';
import { Subject } from 'src/app/models/Subject';
import { ResearcherServiceService } from 'src/app/services/researcher/researcher-service.service';
import { Component, OnInit, Input  } from '@angular/core';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentificationNumberSubjectServiceService } from 'src/app/services/subject/identification-number-subject-service.service';
import { SortSubjectsServiceService } from 'src/app/services/subject/sort-subjects-service.service';
import { ExcelServiceService } from 'src/app/services/excel/excel-service.service';

@Component({
  selector: 'app-home-researcher',
  templateUrl: './home-researcher.component.html',
  styleUrls: ['./home-researcher.component.css']
})
export class HomeResearcherComponent implements OnInit {

  @Input() subjects: Subject[] = [];

  userLogged: User;
  newSubjectForm: FormGroup;

  emptyList: boolean = false;

  successHidden: boolean = false;
  alertHidden: boolean = false;
  alertInvisibleHidden: boolean = true;
  alertWarningHidden: boolean = false;
  alertFilterHidden: boolean;
  successMessage: string = "";
  alertMessage: string = "";
  warningMessage: string = "";
  subjectToDelete: string;


  constructor(private router: Router,
    private http: HttpClient,
     private userService: UserServiceService,
      private researcherService: ResearcherServiceService,
      private adminServiceService: AdminServiceService,
      private identificationNumberSubjectServiceService: IdentificationNumberSubjectServiceService,
      private formBuilder: FormBuilder,
      private sortSubjectsService: SortSubjectsServiceService,
      private excelService: ExcelServiceService
      ) { 

      }

  ngOnInit() {

    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));

    let observable = null;
    
    if(this.userLogged.role === "ADMIN"){
      console.log("ACCEDIENDO DESDE ADMIN...");
      observable = this.adminServiceService.getSubjectsAndInvestigationsFromIdAdmin(this.userLogged.id);
    }
    else{
      console.log("ACCEDIENDO DESDE RESEARCHER...");
      observable = this.researcherService.getSubjectsAndInvestigationsFromIdResearcher(this.userLogged.id);
    }

    if(observable === null){
      this.router.navigate(['/login']);
    }

    else{
      observable.subscribe(response =>{
        this.subjects = response.list;
        if(this.subjects.length === 0){
          this.emptyList = true;
        }
        else{
          this.emptyList = false;
        }


      }, error =>{
        this.router.navigate(['/login']);
      });
    }

    this.newSubjectForm = this.formBuilder.group({
      identificationNumber: ['', Validators.required]
  });
  }

  get f() { return this.newSubjectForm.controls; }

  doLogOut(){
    this.userService.logOutResearcherAndAdmin().subscribe(responseData =>{
      localStorage.removeItem('userLogged');
      this.router.navigate(['/login']);
    });
  }

  doNewForm(idSubject: string, appointment: string){
    console.log(this.subjects);
    this.router.navigate(['/researcher/' + this.userLogged.id + '/subjectForm/' + idSubject + "/" + appointment]);
  }

  showForm(idSubject: string, appointment: string){
    this.router.navigate(['/researcher/' + this.userLogged.id + '/formView/' + idSubject + "/" + appointment]);
  }

  doProfile(){
    this.router.navigate(['/researcher/profile/' + this.userLogged.id]);
  }

  doHome(){
    this.router.navigate(['/researcher/' + this.userLogged.id]);
  }

  registerSubject(){

    if(!this.identificationNumberSubjectServiceService.validateEmptyField(this.f.identificationNumber.value)){
      this.alertMessage = "Número de identificación vacío";
      this.setAlertDeleteModal();
    }

    else if(!this.identificationNumberSubjectServiceService.validateNumberField(this.f.identificationNumber.value)){
      this.alertMessage = "No es un número";
      this.setAlertDeleteModal();
    }

    else if(!this.identificationNumberSubjectServiceService.validateIdentificationNumberLenght(this.f.identificationNumber.value)){
      this.alertMessage = "No es un número de 8 caracteres";
      this.setAlertDeleteModal();
    }

    else{
      var subjectInfo: Subject = new Subject();
      subjectInfo.identificationNumber = this.f.identificationNumber.value;
      subjectInfo.usernameResearcher = this.userLogged.username;
      let observable = this.researcherService.registerSubject(subjectInfo);
    
      if(observable === null){
        this.router.navigate(['/login']);
      }
      else{
        observable.subscribe(responseData =>{
          var subjectCreated: Subject = responseData;
          this.successMessage = "Paciente con Nº" + subjectCreated.identificationNumber + " registrado correctamente";
          this.setSuccessDeleteModal();
          this.ngOnInit();
        }, error =>{
          this.setAlertDeleteModal();
          if(error.status === 409){
            this.alertMessage = "Error, el paciente ya existe";
          }
          else if(error.status === 410){
            this.alertMessage = "Error, el investigador ya no existe";
          }
          else if(error.status === 410){
            this.alertMessage = "Error en el servidor";
          }
        });
      }
    }


    
  }


  deleteSubject(identificationNumber: string){
    let observable = this.researcherService.getNumberInvestigationsCompletedFromSubject(identificationNumber);

    if(observable === null){
      this.router.navigate(['/login']);
    }

    else{
      observable.subscribe(response =>{

        let investigationsCompleted: number = response.numberInvestigationsCompleted;

        if(investigationsCompleted !== 0){

          window.scroll(0,0);

          this.setWarningDeleteModal()

          this.warningMessage = "El paciente " + identificationNumber + " tiene " + investigationsCompleted + " citas completada(s)";
          this.subjectToDelete = identificationNumber;
        }

        else{

          let observable = this.researcherService.deleteSubjectByIdentificationNumberResearcher(identificationNumber);

          if(observable === null){
            this.router.navigate(['/login']);
          }
      
          else{
            observable.subscribe(response =>{
            
              window.scroll(0,0);
      
              this.ngOnInit();
      
              this.setSuccessDeleteModal()

              this.successMessage = "Éxito al borrar al paciente: " + identificationNumber;

            }, error =>{
              this.setAlertDeleteModal()

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

      }, error =>{
        this.setAlertDeleteModal()

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
    let observable = this.researcherService.deleteSubjectByIdentificationNumberResearcher(this.subjectToDelete);

    if(observable === null){
      this.router.navigate(['/login']);
    }

    else{
      observable.subscribe(response =>{  
        this.ngOnInit();
        this.setSuccessDeleteModal();

        this.successMessage = "Éxito al borrar al paciente: " + this.subjectToDelete;

      }, error =>{
        this.setAlertDeleteModal();

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
  }
  
  setSuccessDeleteModal(){
      this.successHidden = true;
      this.alertInvisibleHidden = false;
      this.alertHidden = false;
      this.alertWarningHidden = false;
  }
  
  setAlertDeleteModal(){
      this.successHidden = false;
      this.alertHidden = true;
      this.alertInvisibleHidden = false;
      this.alertWarningHidden = false;
  }
  
  setInvisibleDeleteModal(){
      this.successHidden = false;
      this.alertHidden = false;
      this.alertInvisibleHidden = true;
      this.alertWarningHidden = false;
  }
  
  setWarningDeleteModal(){
      this.successHidden = false;
      this.alertHidden = false;
      this.alertInvisibleHidden = false;
      this.alertWarningHidden = true;
  }

  sortUpIdentificationNumber(){
    this.sortSubjectsService.sortUpIdentificationNumber(this.subjects);
  }

  sortDownIdentificationNumber(){
    this.sortSubjectsService.sortDownIdentificationNumber(this.subjects);
  }

  generateExcel(){

    let rows = [];

    rows[0] = {
      IDENT_PACIENTE: '33333333',
      FECHA_INVESTIGACIÓN: '1',
      VITAMINA_D: 'ravi',
      HBA1C: 1000,
      ESTACIÓN: '33333333',
      SEXO: '33333333',
      NIVEL_ESTUDIOS: 'ravi',
      FECHA_NACIMIENTO: 1000,
      NIVEL_SOCIOECONÓMICO: '33333333',
      TABACO: 'ravi',
      RIESGO_ALCOHOL: 1000,
      EXPOSICIÓN_SOLAR: '33333333',
      CREMA_SPF: 'ravi',
      PUNTUACION_SPF: 1000,
      EJERCICIO: '33333333',
      DM2: 'ravi',
      GLUCOSA: 1000,
      IMC: '33333333',
      OBESIDAD: 'ravi',
      TAS: 1000,
      TAD: '33333333',
      HIPERTENSION_ARTERIAL: 'ravi',
      COLESTEROL: 1000,
      LDL: '33333333',
      HDL: 'ravi',
      TG: 1000,
      DISLIPEMIA: '33333333',
      CREATININA: 'ravi',
      FILTRADO_GLOMERULAR: 1000,
      INSUFICIENCIA_RENAL: '33333333',
      FOTOTIPO: 'ravi',
      TRATAMIENTO_DIABETES: 1000,
      SUPLEMENTACIÓN_VITAMINA_D: '22',
    }; 
    

    this.excelService.generateExcelFile(rows, "INVESTIGACION_" + this.userLogged.name);
  }
}
