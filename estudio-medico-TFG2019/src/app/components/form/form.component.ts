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

  sunExposureValidated: boolean = false;
  sunExposureFirstTime: boolean = true;

  spfCreamValidated: boolean = false;

  spfGradeValidated: boolean = false;

  exerciseValidated: boolean = false;
  exerciseFirstTime: boolean = true;

  //Variables clínicas
  glucoseValidated: boolean = false;
  glucoseFirstTime: boolean = true;

  imcValidated: boolean = false;
  imcFirstTime: boolean = true;

  obesityValidated: boolean = false;

  tasValidated: boolean = false;
  tasFirstTime: boolean = true;

  tadValidated: boolean = false;
  tadFirstTime: boolean = true;

  cholesterolValidated: boolean = false;
  cholesterolFirstTime: boolean = true;

  ldlValidated: boolean = false;
  ldlFirstTime: boolean = true;

  hdlValidated: boolean = false;
  hdlFirstTime: boolean = true;

  tgValidated: boolean = false;
  tgFirstTime: boolean = true;

  dyslipidemiaValidated: boolean = false;

  creatinineValidated: boolean = false;
  creatinineFirstTime: boolean = true;

  glomerularValidated: boolean = false;
  glomerularFirstTime: boolean = true;

  kidneyInsufficiencyValidated: boolean = false;

  diabetesTreatmentValidated: boolean = false;

  vitaminDSupplementationValidated: boolean = false;

  


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
    //console.log(this.form);

    /*
    if(this.validatePrincipalVariables()){
        console.log("VARIABLES PRINCIPALES CORRECTAS");
    }
    */

    if(this.validateLifeHabitsVariables()){
      console.log("HÁBITOS DE VIDA CORRECTOS");
    }
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


  //START CHECKING PRINPIPAL VARIABLES
  checkVitaminD(vitamminDValue: string){
    if(vitamminDValue === ""){
      this.vitaminFirstTime = true;
      this.vitaminFieldValidated = false;
    }
    else{
      this.vitaminFirstTime = false;
      this.vitaminFieldValidated = this.formService.validateVitaminD(vitamminDValue);
    }
  }

  checkHbA1c(hbA1c: string){
    if(hbA1c === ""){
      this.hbA1cFirstTime = true;
      this.hbA1cValidated = false;
    }
    else{
      this.hbA1cFirstTime = false;
      this.hbA1cValidated = this.formService.validateHbA1c(hbA1c);
    } 
  }

  validateSeason(){
    this.seasonValidated = true;
  }

  //END CHECKING PRINPIPAL VARIABLES

  validateGender(){
    console.log("Sexo actualizado");
    this.genderValidated = true;
  }

  validateTobacco(){
    this.tobaccoValidated = true;
  }

  validateAlcoholRisk(){
    this.alcoholRiskValidated = true;
  }

  checkSunExposure(sunExposure: string){
    if(sunExposure === ""){
      this.sunExposureFirstTime = true;
      this.sunExposureValidated = false;
    }
    else{
      this.sunExposureFirstTime = false;
      this.sunExposureValidated = this.formService.validateSunExposure(sunExposure);
    } 
  }

  validateSPFCream(){
    this.spfCreamValidated = true;
  }

  checkExercise(exerciseValue: string){
    if(exerciseValue === ""){
      this.exerciseFirstTime = true;
      this.exerciseValidated = false;
    }
    else{
      this.exerciseFirstTime = false;
      this.exerciseValidated = this.formService.validateExercise(exerciseValue);
    }
  }


  //START CHECKING CLINICAL VARIABLES
  checkGlucose(glucoseValue: string){
    if(glucoseValue === ""){
      this.glucoseFirstTime = true;
      this.glucoseValidated = false;
    }
    else{
      this.glucoseFirstTime = false;
      this.glucoseValidated = this.formService.validateGlucose(glucoseValue);
    }
  }

  checkImc(imcValue: string){
    if(imcValue === ""){
      this.imcFirstTime = true;
      this.imcValidated = false;
    }
    else{
      this.imcFirstTime = false;
      this.imcValidated = this.formService.validateImc(imcValue);
    }
  }

  validateObesity(){
    this.obesityValidated = true;
  }

  checkTas(tasValue: string){
    if(tasValue === ""){
      this.tasFirstTime = true;
      this.tasValidated = false;
    }
    else{
      this.tasFirstTime = false;
      this.tasValidated = this.formService.validateTas(tasValue);
    }
  }

  checkTad(tadValue: string){
    if(tadValue === ""){
      this.tadFirstTime = true;
      this.tadValidated = false;
    }
    else{
      this.tadFirstTime = false;
      this.tadValidated = this.formService.validateTad(tadValue);
    }
  }

  checkCholesterol(cholesterolValue: string){
    if(cholesterolValue === ""){
      this.cholesterolFirstTime = true;
      this.cholesterolValidated = false;
    }
    else{
      this.cholesterolFirstTime = false;
      this.cholesterolValidated = this.formService.validateCholesterol(cholesterolValue);
    }
  }

  checkLdl(ldlValue: string){
    if(ldlValue === ""){
      this.ldlFirstTime = true;
      this.ldlValidated = false;
    }
    else{
      this.ldlFirstTime = false;
      this.ldlValidated = this.formService.validateLdlAndHdl(ldlValue);
    }
  }

  checkHdl(hdlValue: string){
    if(hdlValue === ""){
      this.hdlFirstTime = true;
      this.hdlValidated = false;
    }
    else{
      this.hdlFirstTime = false;
      this.hdlValidated = this.formService.validateLdlAndHdl(hdlValue);
    }
  }

  checkTg(tgValue: string){
    if(tgValue === ""){
      this.tgFirstTime = true;
      this.tgValidated = false;
    }
    else{
      this.tgFirstTime = false;
      this.tgValidated = this.formService.validateTg(tgValue);
    }
  }

  validateDyslipidemia(){
    this.dyslipidemiaValidated = true;
  }

  checkCreatinine(creatinineValue: string){
    if(creatinineValue === ""){
      this.creatinineFirstTime = true;
      this.creatinineValidated = false;
    }
    else{
      this.creatinineFirstTime = false;
      this.creatinineValidated = this.formService.validateCreatinine(creatinineValue);
    }
  }

  checkGlomerular(glomerularValue: string){
    if(glomerularValue === ""){
      this.glomerularFirstTime = true;
      this.glomerularValidated = false;
    }
    else{
      this.glomerularFirstTime = false;
      this.glomerularValidated = this.formService.validateGlomerular(glomerularValue);
    }
  }

  validateKidneyInsufficiency(){
    this.kidneyInsufficiencyValidated = true;
  }

  validateDiabetesTreatment(){
    this.diabetesTreatmentValidated = true;
  }

  validatevitaminDSupplementation(){
    this.vitaminDSupplementationValidated = true;
  }




  validatePrincipalVariables(): boolean{
    console.log("Validando variables principales");
    console.log(this.vitaminFieldValidated + " " + this.form.vitaminaD.value);
    console.log(this.hbA1cValidated + " " + this.form.HbA1c.value);
    console.log(this.seasonValidated + " " + this.form.season.value);
    console.log("=============================================");

    return this.vitaminFieldValidated && this.hbA1cValidated && this.seasonValidated;
  }

  validateLifeHabitsVariables(): boolean{
    console.log(this.tobaccoValidated + " " + this.form.smoking.value);
    console.log(this.alcoholRiskValidated + " " + this.form.alcohol.value);
    console.log(this.sunExposureValidated + " " + this.form.solarExposition.value);
    console.log(this.spfCreamValidated + " " + this.form.creamSPF.value);
    

    if(this.form.gradeSPF.value !== undefined){
      this.spfGradeValidated = true;
    }

    console.log(this.spfGradeValidated + " " + this.form.gradeSPF.value);

    console.log(this.exerciseValidated + " " + this.form.exercies.value);

    console.log("=============================================");

    return this.tobaccoValidated &&
    this.alcoholRiskValidated &&
    this.sunExposureValidated &&
    this.spfCreamValidated &&
    this.spfGradeValidated &&
    this.exerciseValidated;

  }
}
