import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { Subject } from 'src/app/models/Subject';
import { ResearcherServiceService } from 'src/app/services/researcher/researcher-service.service';
import { Component, OnInit, Input, ɵConsole  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentificationNumberSubjectServiceService } from 'src/app/services/subject/identification-number-subject-service.service';
import { SortSubjectsServiceService } from 'src/app/services/subject/sort-subjects-service.service';
import { ExcelServiceService } from 'src/app/services/excel/excel-service.service';
import { Appointment } from 'src/app/models/Appointment';

@Component({
  selector: 'app-home-researcher',
  templateUrl: './home-researcher.component.html',
  styleUrls: ['./home-researcher.component.css']
})
export class HomeResearcherComponent implements OnInit {

  @Input() subjects: Subject[] = [];

  userLogged: User;
  newSubjectForm: FormGroup;

  successHidden: boolean = false;
  alertHidden: boolean = false;
  alertInvisibleHidden: boolean = true;
  alertFilterHidden: boolean;
  successMessage: string = "";
  alertMessage: string = "";


  constructor(private router: Router,
      private researcherService: ResearcherServiceService,
      private identificationNumberSubjectService: IdentificationNumberSubjectServiceService,
      private formBuilder: FormBuilder,
      private sortSubjectsService: SortSubjectsServiceService,
      private excelService: ExcelServiceService
    ) { 
  }

  ngOnInit() {
    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));
    
    let observable = this.researcherService.getSubjectsAndInvestigationsFromIdResearcher(this.userLogged.id);

    if(observable === null){
      this.router.navigate(['/login']);
    }

    else{
      observable.subscribe(response =>{
        this.subjects = response.list;
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
    localStorage.removeItem('userLogged');
    this.router.navigate(['/login']);
  }

  doAdminView(){
    this.router.navigate(['/admin/researchers']);
  }

  doNewForm(idSubject: string, appointment: string){
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
    if(!this.identificationNumberSubjectService.validateEmptyField(this.f.identificationNumber.value)){
      this.alertMessage = "Número de identificación vacío";
      this.setAlertDeleteModal();
    }
    else if(!this.identificationNumberSubjectService.validateNumberField(this.f.identificationNumber.value)){
      this.alertMessage = "No es un número";
      this.setAlertDeleteModal();
    }
    else if(!this.identificationNumberSubjectService.validateIdentificationNumberLenght(this.f.identificationNumber.value)){
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
          else if(error.status === 500){
            this.alertMessage = "Error en el servidor";
          }
        });
      }
    }
  }

  setSuccessDeleteModal(){
      this.successHidden = true;
      this.alertInvisibleHidden = false;
      this.alertHidden = false;
  }
  
  setAlertDeleteModal(){
      this.successHidden = false;
      this.alertHidden = true;
      this.alertInvisibleHidden = false;
  }
  
  setInvisibleDeleteModal(){
      this.successHidden = false;
      this.alertHidden = false;
      this.alertInvisibleHidden = true;
  }
  
  setWarningDeleteModal(){
      this.successHidden = false;
      this.alertHidden = false;
      this.alertInvisibleHidden = false;
  }

  sortUpIdentificationNumber(){
    this.sortSubjectsService.sortUpIdentificationNumber(this.subjects);
  }

  sortDownIdentificationNumber(){
    this.sortSubjectsService.sortDownIdentificationNumber(this.subjects);
  }

  generateExcel(){
    let observable = this.researcherService.getAllAppointmentDetails(this.userLogged.id);

    if(observable === null){
      this.router.navigate(['/login']);
    }

    else{
      observable.subscribe(responseData =>{
        let appointments: Appointment[] = [];
        appointments = responseData;

        var info = {
          list: []
        };

        for(var i in appointments["list"]) {    
          var elem = appointments["list"][i];  
          
          if(elem.birthDate !== null){
            elem.birthDate = new Date(elem.birthDate);
          }
          if(elem.investigationDate !== null){
            elem.investigationDate = new Date(elem.investigationDate);
          }

          info.list.push({ 
              "IDENT_PACIENTE" : elem.identificationNumber,
              "FECHA_REALIZACIÓN"  : elem.investigationDate,
              "VITAMINA_D" : elem.vitaminD,
              "HBA1C"  : elem.hba1c,
              "ESTACIÓN"       : elem.season, 
              "SEXO" : elem.gender,
              "NIVEL_ESTUDIOS"  : elem.studyLevel,
              "FECHA_NACIMIENTO"       : elem.birthDate,
              "NIVEL_SOCIOECONÓMICO" : elem.socioeconomicLevel,
              "TABACO"  : elem.tobacco,
              "RIESGO_ALCOHOL"       : elem.riskAlcohol,
              "EXPOSICIÓN_SOLAR" : elem.solarExposure,
              "CREMA_SPF"  : elem.spfCream,
              "PUNTUACION_SPF"       : elem.spfScore,
              "EJERCICIO" : elem.exercise,
              "DM2"  : elem.dm2,
              "GLUCOSA"       : elem.glucose,
              "IMC" : elem.imc,
              "OBESIDAD"  : elem.obesity,
              "TAS"       : elem.tas,
              "TAD" : elem.tad,
              "HIPERTENSION_ARTERIAL"  : elem.arterialHypertension,
              "COLESTEROL"       : elem.cholesterol,
              "LDL" : elem.ldl,
              "HDL"  : elem.hdl,
              "TG"       : elem.tg,
              "DISLIPEMIA" : elem.dyslipemy,
              "CREATININA"  : elem.creatinine,
              "FILTRADO_GLOMERULAR"       : elem.glomerular,
              "INSUFICIENCIA_RENAL" : elem.kidneyInsufficiency,
              "FOTOTIPO"  : elem.fototype,
              "TRATAMIENTO_DIABETES"  : elem.diabetesTreatment,
              "SUPLEMENTACIÓN_VITAMINA_D" : elem.vitaminDSupplementation,
          });
        }

        this.setSuccessDeleteModal();
        this.successMessage = "Documento excel generado correctamente";
        let today = new Date();
        let day = today.getUTCDate();
        let month = today.getUTCMonth() + 1;
        let year = today.getUTCFullYear();
        this.excelService.generateExcelFile(info.list, "INVESTIGACION_" + this.userLogged.name  + "_" + day + "/" + month + "/" + year);
      }, error =>{
        this.alertMessage = "Fallo al generar el documento excel";
        this.setAlertDeleteModal();
      });
    }
  }
}
