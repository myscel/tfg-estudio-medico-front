import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServiceService } from 'src/app/services/userService.service';
import { FormServiceService } from 'src/app/services/form/form-service.service';
import { Appointment } from 'src/app/models/Appointment';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  userLogged: User;
  subjectForm: FormGroup;
  appointmentToSave: Appointment = new Appointment();

  successHidden: boolean = false;
  alertHidden: boolean = false;
  alertMessage: string = "";
  alertWarningExitHidden: boolean = false;
  alertWarningSaveHidden: boolean = false;

  alertInvisibleHidden: boolean = true;


  //Variables principales
  vitaminFieldValidated: boolean = false;
  vitaminFirstTime: boolean = true;

  hbA1cValidated: boolean = false;
  hbA1cFirstTime: boolean = true;

  seasonValidated: boolean = false;

  //Variables sociodemográficas
  genderValidated: boolean = false;
  studyLevelValidated: boolean = false;
  birthDateValidated: boolean = false;
  economicLevelValidated: boolean = false;

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
  DM2Validated: boolean = false;

  glucoseValidated: boolean = false;
  glucoseFirstTime: boolean = true;

  imcValidated: boolean = false;
  imcFirstTime: boolean = true;

  obesityValidated: boolean = false;

  tasValidated: boolean = false;
  tasFirstTime: boolean = true;

  tadValidated: boolean = false;
  tadFirstTime: boolean = true;

  arterialHypertensionValidated: boolean = false;

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

  fototypeValidated: boolean = false;


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

    this.setInvisibleModal();

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
      exercise: ['', Validators.required],
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
    if(this.validatePrincipalVariables() && 
      this.validateLifeHabitsVariables() && 
      this.validateClinicalVariables() &&
      this.validateSociodemographicVariables() 
    ){
      this.setWarningSaveModal();
    }
    else{
      this.setAlertodal();
      this.alertMessage = "Algunos campos tienen valores incorrectos"
    }

  }

  doSave(){
    this.saveAppointment();
    console.log(this.appointmentToSave);
  }

  doHome(){
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

  //START CHECKING SOCIODEMOGRAPHIC VARIABLES
  validateGender(){
    console.log("Sexo actualizado");
    this.genderValidated = true;
  }

  validateBirthDate(birthDate: Date): boolean{
    let today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }    
    console.log("EDAD: " + age);

    return age >= 18;
  }
  //END CHECKING SOCIODEMOGRAPHIC VARIABLES

  //START CHECKING LIFESTYLE VARIABLES
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
  //END CHECKING LIFESTYLE VARIABLES


  //START CHECKING CLINICAL VARIABLES

  validateDM2(){
    this.DM2Validated = true;
  }

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

  validateArterialHypertension(){
    this.arterialHypertensionValidated = true;
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
   //END CHECKING CLINICAL VARIABLES


  validatePrincipalVariables(): boolean{
    console.log("Validando variables principales");
    console.log(this.vitaminFieldValidated + " " + this.form.vitaminaD.value);
    console.log(this.hbA1cValidated + " " + this.form.HbA1c.value);
    console.log(this.seasonValidated + " " + this.form.season.value);
    console.log("=============================================");

    return this.vitaminFieldValidated && this.hbA1cValidated && this.seasonValidated;
  }

  validateLifeHabitsVariables(): boolean{
    console.log("Validando variables de Hábitos de vida");

    console.log(this.tobaccoValidated + " " + this.form.smoking.value);
    console.log(this.alcoholRiskValidated + " " + this.form.alcohol.value);
    console.log(this.sunExposureValidated + " " + this.form.solarExposition.value);
    console.log(this.spfCreamValidated + " " + this.form.creamSPF.value);
    

    if(this.form.gradeSPF.value !== undefined){
      this.spfGradeValidated = true;
    }

    console.log(this.spfGradeValidated + " " + this.form.gradeSPF.value);

    console.log(this.exerciseValidated + " " + this.form.exercise.value);

    console.log("=============================================");

    return this.tobaccoValidated &&
    this.alcoholRiskValidated &&
    this.sunExposureValidated &&
    this.spfCreamValidated &&
    this.spfGradeValidated &&
    this.exerciseValidated;
  }

  validateSociodemographicVariables(): boolean{
    console.log("Validando variables sociodemográficas");

    console.log(this.genderValidated + " " + this.form.gender.value);

    if(this.form.studies.value !== undefined){
      this.studyLevelValidated = true;
    }
    console.log(this.studyLevelValidated + " " + this.form.studies.value);

    if(this.form.bornDate.value !== undefined && this.validateBirthDate(this.form.bornDate.value)){
      this.birthDateValidated = true;
    }
    console.log(this.birthDateValidated + " " + this.form.bornDate.value);

    if(this.form.economicLevel.value !== undefined){
      this.economicLevelValidated = true;
    }
    console.log(this.economicLevelValidated + " " + this.form.economicLevel.value);

    console.log("=============================================");

    return this.genderValidated &&
    this.studyLevelValidated &&
    this.birthDateValidated &&
    this.economicLevelValidated;
  }

  validateClinicalVariables(): boolean{
    console.log("Validando variables clínicas");

    console.log(this.DM2Validated + " " + this.form.DM2.value);
    console.log(this.glucoseValidated + " " + this.form.bloodGlucose.value);
    console.log(this.imcValidated + " " + this.form.IMC.value);

    console.log(this.obesityValidated + " " + this.form.obesity.value);
    console.log(this.tasValidated + " " + this.form.TAS.value);
    console.log(this.tadValidated + " " + this.form.TAD.value);

    console.log(this.arterialHypertensionValidated + " " + this.form.arterialHypertension.value);
    console.log(this.cholesterolValidated + " " + this.form.cholesterol.value);
    console.log(this.ldlValidated + " " + this.form.LDL.value);

    console.log(this.hdlValidated + " " + this.form.HDL.value);
    console.log(this.tgValidated + " " + this.form.TG.value);
    console.log(this.dyslipidemiaValidated + " " + this.form.dyslipidemia.value);

    console.log(this.creatinineValidated + " " + this.form.creatinine.value);
    console.log(this.glomerularValidated + " " + this.form.glomerular.value);
    console.log(this.kidneyInsufficiencyValidated + " " + this.form.chronicRenalFailure.value);

    if(this.form.fototype.value !== undefined){
      this.fototypeValidated = true;
    }

    console.log(this.fototypeValidated + " " + this.form.fototype.value);

    console.log(this.diabetesTreatmentValidated + " " + this.form.diabetesTreatment.value);
    console.log(this.vitaminDSupplementationValidated + " " + this.form.vitaminDSupplementation.value);
    console.log("=============================================");

    return this.DM2Validated &&
    this.glucoseValidated &&
    this.imcValidated &&
    this.obesityValidated &&
    this.tasValidated &&
    this.tadValidated &&
    this.arterialHypertensionValidated &&
    this.cholesterolValidated &&
    this.ldlValidated &&
    this.hdlValidated &&
    this.tgValidated &&
    this.dyslipidemiaValidated &&
    this.creatinineValidated &&
    this.glomerularValidated &&
    this.kidneyInsufficiencyValidated &&
    this.fototypeValidated &&
    this.diabetesTreatmentValidated &&
    this.vitaminDSupplementationValidated;
  }

  setSuccessModal(){
    this.successHidden = true;
    this.alertInvisibleHidden = false;
    this.alertHidden = false;
    this.alertWarningExitHidden = false;
    this.alertWarningSaveHidden = false;

  }

  setAlertodal(){
    this.successHidden = false;
    this.alertHidden = true;
    this.alertWarningExitHidden = false;
    this.alertInvisibleHidden = false;
    this.alertWarningSaveHidden = false;

  }

  setWarningExitModal(){
    this.successHidden = false;
    this.alertHidden = false;
    this.alertWarningExitHidden = true;
    this.alertWarningSaveHidden = false;
    this.alertInvisibleHidden = false;
  }

  setWarningSaveModal(){
    this.successHidden = false;
    this.alertHidden = false;
    this.alertWarningExitHidden = false;
    this.alertWarningSaveHidden = true;
    this.alertInvisibleHidden = false;
  }

  
  setInvisibleModal(){
    this.successHidden = false;
    this.alertHidden = false;
    this.alertWarningExitHidden = false;
    this.alertWarningSaveHidden = false;
    this.alertInvisibleHidden = true;
  }

  tryExit(){
    this.setWarningExitModal();
  }

  saveAppointment(){
    this.appointmentToSave.vitaminD = this.form.vitaminaD.value;
    this.appointmentToSave.hba1c = this.form.HbA1c.value;
    this.appointmentToSave.season = this.form.season.value;

    this.appointmentToSave.gender = this.form.gender.value;
    this.appointmentToSave.studyLevel = this.form.studies.value;
    this.appointmentToSave.birthDate = this.form.bornDate.value;
    this.appointmentToSave.socioeconomicLevel = this.form.economicLevel.value;

    this.appointmentToSave.tobacco = this.form.smoking.value;
    this.appointmentToSave.riskAlcohol = this.form.alcohol.value;
    this.appointmentToSave.solarExposure = this.form.solarExposition.value; 
    this.appointmentToSave.spfCream = this.form.creamSPF.value;
    this.appointmentToSave.spfScore = this.form.gradeSPF.value;
    this.appointmentToSave.exercise = this.form.exercise.value;

    this.appointmentToSave.dm2 = this.form.DM2.value;
    this.appointmentToSave.glucose = this.form.bloodGlucose.value;
    this.appointmentToSave.imc = this.form.IMC.value; 
    this.appointmentToSave.obesity = this.form.obesity.value;
    this.appointmentToSave.tas = this.form.TAS.value;
    this.appointmentToSave.tad = this.form.TAD.value;
    this.appointmentToSave.arterialHypertension = this.form.arterialHypertension.value;
    this.appointmentToSave.cholesterol = this.form.cholesterol.value;
    this.appointmentToSave.ldl = this.form.LDL.value; 
    this.appointmentToSave.hdl = this.form.HDL.value;
    this.appointmentToSave.tg = this.form.TG.value;
    this.appointmentToSave.dyslipemy = this.form.dyslipidemia.value;
    this.appointmentToSave.creatinine = this.form.creatinine.value;
    this.appointmentToSave.glomerular = this.form.glomerular.value;
    this.appointmentToSave.kidneyInsufficiency = this.form.chronicRenalFailure.value; 
    this.appointmentToSave.fototype = this.form.fototype.value;
    this.appointmentToSave.diabetesTreatment = this.form.diabetesTreatment.value;
    this.appointmentToSave.vitaminDSupplementation = this.form.vitaminDSupplementation.value;
  }



}
