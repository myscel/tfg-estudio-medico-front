import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServiceService } from 'src/app/services/userService.service';
import { FormServiceService } from 'src/app/services/form/form-service.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  userLogged: User;
  subjectForm: FormGroup;


  //Variables principales
  vitaminFieldValidated: boolean = false;
  vitaminFirstTime: boolean = true;

  hbA1cValidated: boolean = false;
  hbA1cFirstTime: boolean = true;

  seasonValidated: boolean = false;

  //Variables sociodemográficas
  genderValidated: boolean = false

  //Hábitos de vida
  tobaccoValidated: boolean = false;
  alcoholRiskValidated: boolean = false;

  constructor(private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private userService: UserServiceService,
    private formService: FormServiceService) { }

  ngOnInit() {
    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));

    this.subjectForm = this.formBuilder.group({
      vitaminaD: ['', Validators.required],
      HbA1c: ['', Validators.required],
      season: ['', Validators.required],
      gender: ['', Validators.required],
      studies: ['', Validators.required],
      bornDate: ['', Validators.required],
      economicLevel: ['', Validators.required],
      smoking: ['', Validators.required],
      alcohol: ['', Validators.required],
      solarExposition: ['', Validators.required],
      creamSPF: ['', Validators.required],
      gradeSPF: ['', Validators.required],
      exercies: ['', Validators.required],
      DM2: ['', Validators.required],
      bloodGlucose: ['', Validators.required],
      IMC: ['', Validators.required],
      obesity: ['', Validators.required],
      TAS: ['', Validators.required],
      TAD: ['', Validators.required],
      arterialHypertension: ['', Validators.required],
      cholesterol: ['', Validators.required],
      LDL: ['', Validators.required],
      HDL: ['', Validators.required],
      TG: ['', Validators.required],
      dyslipidemia: ['', Validators.required],
      creatinine: ['', Validators.required],
      glomerular: ['', Validators.required],
      chronicRenalFailure: ['', Validators.required],
      fototype: ['', Validators.required],
      diabetesTreatment: ['', Validators.required],
      vitaminDSupplementation: ['', Validators.required]
    });
  }

  get form() { return this.subjectForm.controls; }

  onSubmit() {
    console.log(this.form.season);
    console.log(this.form);
  }

  doHome(){
    console.log("Vamos a pacientes");
    this.router.navigate(['/researcher/' + this.userLogged.id]);
  }

  doLogOut(){
    this.userService.logOutResearcherAndAdmin().subscribe(responseData =>{
      localStorage.removeItem('userLogged');
      this.router.navigate(['/login']);
    });
  }


  checkVitaminD(vitamminDValue: string){
    if(vitamminDValue === ""){
      this.vitaminFirstTime = true;
    }
    else{
      this.vitaminFirstTime = false;
      this.vitaminFieldValidated = this.formService.validateVitaminD(vitamminDValue);
    }
  }

  checkHbA1c(hbA1c: string){
    if(hbA1c === ""){
      this.hbA1cFirstTime = true;
    }
    else{
      this.hbA1cFirstTime = false;
      this.hbA1cValidated = this.formService.validateHbA1c(hbA1c);
    } 
  }

  validateSeason(){
    console.log("Estación actualizada");

    this.seasonValidated = true;
  }

  validateGender(){
    console.log("Sexo actualizado");
    this.genderValidated = true;
  }

  validateTobacco(){
    console.log("Tabaco actualizado");
    this.tobaccoValidated = true;
  }

  validateAlcoholRisk(){
    console.log("Riesgo alcohol actualizado");
    this.alcoholRiskValidated = true;
  }
}
