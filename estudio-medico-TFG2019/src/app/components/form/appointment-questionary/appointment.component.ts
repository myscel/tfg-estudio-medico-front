import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Appointment } from 'src/app/models/Appointment';
import { ResearcherServiceService } from 'src/app/services/researcher/researcher-service.service';
import { FormServiceService } from 'src/app/services/form/form-service.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {

  userLogged: User;
  subjectForm: FormGroup;
  appointmentToSave: Appointment = new Appointment();

  successHidden: boolean = false;
  successMessage: string = " Cita guardada correctamente.";
  alertHidden: boolean = false;
  alertMessage: string = "";
  alertWarningExitHidden: boolean = false;
  alertWarningSaveHidden: boolean = false;

  alertInvisibleHidden: boolean = true;

  formSaved: boolean = false;

  birthDate: Date = new Date();

  //Principal variables
  vitaminFieldValidated: boolean = false;
  vitaminFirstTime: boolean = true;

  hbA1cValidated: boolean = false;
  hbA1cFirstTime: boolean = true;

  seasonValidated: boolean = false;

  //Sociodemographic variables
  genderValidated: boolean = false;
  studyLevelValidated: boolean = false;
  birthDateValidated: boolean = false;
  economicLevelValidated: boolean = false;

  //Lifestyle
  tobaccoValidated: boolean = false;

  alcoholRiskValidated: boolean = false;

  sunExposureValidated: boolean = false;
  sunExposureFirstTime: boolean = true;

  spfCreamValidated: boolean = false;

  spfGradeValidated: boolean = false;

  exerciseValidated: boolean = false;
  exerciseFirstTime: boolean = true;

  //Clinic variables
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
    private formBuilder: FormBuilder,
    private formService: FormServiceService,
    private route: ActivatedRoute,
    private researcherService: ResearcherServiceService) { }

  ngOnInit() {
    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));
    this.checkUserLogged();

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
      this.validateSociodemographicVariables() &&
      this.validateLifeHabitsVariables() && 
      this.validateClinicalVariables()
    ){
      this.setWarningSaveModal();
    }
    else{
      this.setAlertodal();
    }
  }

  doSave(){
    this.saveAppointment();
    this.appointmentToSave.numberInvestigation = Number(this.route.snapshot.paramMap.get('appointment'));
    this.appointmentToSave.idSubject = Number(this.route.snapshot.paramMap.get('idSubject'));

    let today = new Date();
    this.appointmentToSave.investigationDate = today;
    this.researcherService.registerAppointment(this.appointmentToSave).subscribe(responseData =>{
      this.setSuccessModal();
      this.formSaved = true;

    }, error =>{
      if(error.status === 409){
        this.alertMessage = "No se pudo registrar la cita";
      }
      else{
        this.alertMessage = "Fallo en el servidor";
      }
      this.setAlertodal();
    });
  }

  doHome(){
    this.router.navigate(['/researcher/' + this.userLogged.id]);
  }

  doLogOut(){
    localStorage.removeItem('userLogged');
    this.router.navigate(['/login']);
  }

  doProfile() {
    this.router.navigate(['/researcher/profile/' + this.userLogged.id]);
  }

  doAdminView(){
    this.router.navigate(['/admin/researchers']);
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
    this.genderValidated = true;
  }

  validateBirthDate(birthDate: Date): boolean{
    return this.formService.validateBirthDate(birthDate);
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
    if(!this.vitaminFieldValidated){
      this.alertMessage = "campo vitamina D erróneo";
      return false;
    }
    if(!this.hbA1cValidated){
      this.alertMessage = "campo hbA1c erróneo";
      return false;
    }
    if(!this.seasonValidated){
      this.alertMessage = "campo estación del año erróneo";
      return false;
    }
    return this.vitaminFieldValidated && this.hbA1cValidated && this.seasonValidated;
  }

  validateLifeHabitsVariables(): boolean{
    if(this.form.gradeSPF.value !== undefined){
      this.spfGradeValidated = true;
    }
    else{
      this.spfGradeValidated = false;
    }

    if(!this.tobaccoValidated){
      this.alertMessage = "campo tabaco erróneo";
      return false;
    }
    if(!this.alcoholRiskValidated){
      this.alertMessage = "campo riesgo de alcohol erróneo";
      return false;
    }
    if(!this.sunExposureValidated){
      this.alertMessage = "campo exposición solar erróneo";
      return false;
    }
    if(!this.spfCreamValidated){
      this.alertMessage = "campo crema SPF erróneo";
      return false;
    }
    if(!this.spfGradeValidated){
      this.alertMessage = "campo puntuación SPF erróneo";
      return false;
    }
    if(!this.exerciseValidated){
      this.alertMessage = "campo ejercicio físico erróneo";
      return false;
    }

    return this.tobaccoValidated &&
    this.alcoholRiskValidated &&
    this.sunExposureValidated &&
    this.spfCreamValidated &&
    this.spfGradeValidated &&
    this.exerciseValidated;
  }

  validateSociodemographicVariables(): boolean{
    if(this.form.studies.value !== undefined){
      this.studyLevelValidated = true;
    }
    else{
      this.studyLevelValidated = false;
    }
    
    if(this.form.bornDate.value !== undefined){
      this.birthDate = new Date( this.form.bornDate.value.getTime() + this.form.bornDate.value.getTimezoneOffset() * -60000 )
    }
  
    if(this.form.bornDate.value !== undefined && this.validateBirthDate(this.birthDate)){
      this.birthDateValidated = true;
    }
    else{
      this.birthDateValidated = false;
    }

    if(this.form.economicLevel.value !== undefined){
      this.economicLevelValidated = true;
    }
    else{
      this.economicLevelValidated = false;
    }

    if(!this.genderValidated){
      this.alertMessage = "campo sexo erróneo";
      return false;
    }
    if(!this.studyLevelValidated){
      this.alertMessage = "campo nivel de estudios erróneo";
      return false;
    }
    if(!this.birthDateValidated){
      this.alertMessage = "campo fecha de nacimiento erróneo";
      return false;
    }
    if(!this.economicLevelValidated){
      this.alertMessage = "campo nivel socioeconómico erróneo";
      return false;
    }

    return this.genderValidated &&
    this.studyLevelValidated &&
    this.birthDateValidated &&
    this.economicLevelValidated;
  }

  validateClinicalVariables(): boolean{
    if(this.form.fototype.value !== undefined){
      this.fototypeValidated = true;
    }
    else{
      this.fototypeValidated = false;
    }

    if(!this.DM2Validated){
      this.alertMessage = "campo DM2 erróneo";
      return false;
    }
    if(!this.glucoseValidated){
      this.alertMessage = "campo glucemia erróneo";
      return false;
    }
    if(!this.imcValidated){
      this.alertMessage = "campo IMC erróneo";
      return false;
    }
    if(!this.obesityValidated){
      this.alertMessage = "campo obesidad erróneo";
      return false;
    }
    if(!this.tasValidated){
      this.alertMessage = "campo tas erróneo";
      return false;
    }
    if(!this.tadValidated){
      this.alertMessage = "campo tad erróneo";
      return false;
    }
    if(!this.arterialHypertensionValidated){
      this.alertMessage = "campo hipertensión arterial erróneo";
      return false;
    }
    if(!this.cholesterolValidated){
      this.alertMessage = "campo colesterol erróneo";
      return false;
    }
    if(!this.ldlValidated){
      this.alertMessage = "campo ldl erróneo";
      return false;
    }
    if(!this.hdlValidated){
      this.alertMessage = "campo hdl erróneo";
      return false;
    }
    if(!this.tgValidated){
      this.alertMessage = "campo tg erróneo";
      return false;
    }
    if(!this.dyslipidemiaValidated){
      this.alertMessage = "campo dislipemia erróneo";
      return false;
    }
    if(!this.creatinineValidated){
      this.alertMessage = "campo creatinina erróneo";
      return false;
    }
    if(!this.glomerularValidated){
      this.alertMessage = "campo filtrado glomerular erróneo";
      return false;
    }
    if(!this.kidneyInsufficiencyValidated){
      this.alertMessage = "campo insuficiencia renal erróneo";
      return false;
    }
    if(!this.fototypeValidated){
      this.alertMessage = "campo fototipo erróneo";
      return false;
    }
    if(!this.diabetesTreatmentValidated){
      this.alertMessage = "campo nivel de estudios erróneo";
      return false;
    }
    if(!this.vitaminDSupplementationValidated){
      this.alertMessage = "campo tratamiento diabetes erróneo";
      return false;
    }

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
    this.appointmentToSave.birthDate = this.birthDate;
    this.appointmentToSave.socioeconomicLevel = this.form.economicLevel.value;

    this.appointmentToSave.tobacco = this.form.smoking.value;
    this.appointmentToSave.riskalcohol = this.form.alcohol.value;
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

  checkUserLogged(){
    let id = this.route.snapshot.paramMap.get('id');

    if(id != this.userLogged.id){
      this.doLogOut();
    }
  }
}
