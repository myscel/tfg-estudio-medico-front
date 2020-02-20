import { Router, ActivatedRoute } from '@angular/router';
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
      private excelService: ExcelServiceService,
      private route: ActivatedRoute
    ) { 
  }

  ngOnInit() {
    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));
    this.checkUserLogged();
    
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

        var elemAnterior;
        var elem;

        for(var i in appointments["list"]) {    
          if(Number(i) % 2 === 0){
            elemAnterior = appointments["list"][i];
          }
          else{
            elem = appointments["list"][i];
            if(elem.birthDate !== null){
              elem.birthDate = new Date(elem.birthDate);
            }
            if(elem.investigationDate !== null){
              elem.investigationDate = new Date(elem.investigationDate);
            }

            if(elemAnterior.birthDate !== null){
              elemAnterior.birthDate = new Date(elemAnterior.birthDate);
            }
            if(elemAnterior.investigationDate !== null){
              elemAnterior.investigationDate = new Date(elemAnterior.investigationDate);
            }
  
            info.list.push({ 
                "IDENT_PACIENTE" : elem.identificationNumber,

                "FECHA_REALIZACIÓN_1"  : elemAnterior.investigationDate,
                "VITAMINA_D_1" : elemAnterior.vitaminD,
                "HBA1C_1"  : elemAnterior.hba1c,
                "ESTACIÓN_1"       : elemAnterior.season, 
                "SEXO_1" : elemAnterior.gender,
                "NIVEL_ESTUDIOS_1"  : elemAnterior.studyLevel,
                "FECHA_NACIMIENTO_1"       : elemAnterior.birthDate,
                "NIVEL_SOCIOECONÓMICO_1" : elemAnterior.socioeconomicLevel,
                "TABACO_1"  : elemAnterior.tobacco,
                "RIESGO_ALCOHOL_1"       : elemAnterior.riskAlcohol,
                "EXPOSICIÓN_SOLAR_1" : elemAnterior.solarExposure,
                "CREMA_SPF_1"  : elemAnterior.spfCream,
                "PUNTUACION_SPF_1"       : elemAnterior.spfScore,
                "EJERCICIO_1" : elemAnterior.exercise,
                "DM2_1"  : elemAnterior.dm2,
                "GLUCOSA_1"       : elemAnterior.glucose,
                "IMC_1" : elemAnterior.imc,
                "OBESIDAD_1"  : elemAnterior.obesity,
                "TAS_1"       : elemAnterior.tas,
                "TAD_1" : elemAnterior.tad,
                "HIPERTENSION_ARTERIAL_1"  : elemAnterior.arterialHypertension,
                "COLESTEROL_1"       : elemAnterior.cholesterol,
                "LDL_1" : elemAnterior.ldl,
                "HDL_1"  : elemAnterior.hdl,
                "TG_1"       : elemAnterior.tg,
                "DISLIPEMIA_1" : elemAnterior.dyslipemy,
                "CREATININA_1"  : elemAnterior.creatinine,
                "FILTRADO_GLOMERULAR_1"       : elemAnterior.glomerular,
                "INSUFICIENCIA_RENAL_1" : elemAnterior.kidneyInsufficiency,
                "FOTOTIPO_1"  : elemAnterior.fototype,
                "TRATAMIENTO_DIABETES_1"  : elemAnterior.diabetesTreatment,
                "SUPLEMENTACIÓN_VITAMINA_D_1" : elemAnterior.vitaminDSupplementation,

                "FECHA_REALIZACIÓN_2"  : elem.investigationDate,
                "VITAMINA_D_2" : elem.vitaminD,
                "HBA1C_2"  : elem.hba1c,
                "ESTACIÓN_2"       : elem.season, 
                "SEXO_2" : elem.gender,
                "NIVEL_ESTUDIOS_2"  : elem.studyLevel,
                "FECHA_NACIMIENTO_2"       : elem.birthDate,
                "NIVEL_SOCIOECONÓMICO_2" : elem.socioeconomicLevel,
                "TABACO_2"  : elem.tobacco,
                "RIESGO_ALCOHOL_2"       : elem.riskAlcohol,
                "EXPOSICIÓN_SOLAR_2" : elem.solarExposure,
                "CREMA_SPF_2"  : elem.spfCream,
                "PUNTUACION_SPF_2"       : elem.spfScore,
                "EJERCICIO_2" : elem.exercise,
                "DM2_2"  : elem.dm2,
                "GLUCOSA_2"       : elem.glucose,
                "IMC_2" : elem.imc,
                "OBESIDAD_2"  : elem.obesity,
                "TAS_2"       : elem.tas,
                "TAD_2" : elem.tad,
                "HIPERTENSION_ARTERIAL_2"  : elem.arterialHypertension,
                "COLESTEROL_2"       : elem.cholesterol,
                "LDL_2" : elem.ldl,
                "HDL_2"  : elem.hdl,
                "TG_2"       : elem.tg,
                "DISLIPEMIA_2" : elem.dyslipemy,
                "CREATININA_2"  : elem.creatinine,
                "FILTRADO_GLOMERULAR_2"       : elem.glomerular,
                "INSUFICIENCIA_RENAL_2" : elem.kidneyInsufficiency,
                "FOTOTIPO_2"  : elem.fototype,
                "TRATAMIENTO_DIABETES_2"  : elem.diabetesTreatment,
                "SUPLEMENTACIÓN_VITAMINA_D_2" : elem.vitaminDSupplementation,
            });
          }       
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

  checkUserLogged(){
    let id = this.route.snapshot.paramMap.get('id');

    if(id != this.userLogged.id){
      this.doLogOut();
    }
  }
}
