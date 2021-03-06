import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/User';
import { AdminServiceService } from 'src/app/services/admin/admin-service.service';
import { Appointment } from 'src/app/models/Appointment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormServiceService } from 'src/app/services/form/form-service.service';

@Component({
  selector: 'app-modify-appointment',
  templateUrl: './modify-appointment.component.html',
  styleUrls: ['./modify-appointment.component.css']
})
export class ModifyAppointmentComponent implements OnInit {

  userLogged: User;

  appointment: Appointment;
  appointmentToUpdate: Appointment = new Appointment();
  identificationNumber: number;
  subjectForm: FormGroup;

  investigationDay: number;
  investigationMonth: number;
  investigationYear: number;

  birthDay: number;
  birthMonth: number;
  birthYear: number;

  birthDate: Date = new Date();

  successHidden: boolean = false;
  successMessage: string = " Cita modificada correctamente.";
  alertHidden: boolean = false;
  alertMessage: string = "";
  alertWarningExitHidden: boolean = false;
  alertWarningSaveHidden: boolean = false;

  alertInvisibleHidden: boolean = true;

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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private formService: FormServiceService,
    private activatedRoute: ActivatedRoute,
    private adminService: AdminServiceService,
    private route: ActivatedRoute,
  ) { 
  }

  ngOnInit() {
    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));
    this.appointment = new Appointment();

    let investigationsDetailsId = this.activatedRoute.snapshot.params.investigationsDetailsId;
    this.identificationNumber = this.activatedRoute.snapshot.params.subjectIdentificationNumber

    this.adminService.getAppointmentDetails(investigationsDetailsId).subscribe(responseData =>{

      this.appointment = responseData;
      
      this.appointment.birthDate = new Date(this.appointment.birthDate);
      this.birthMonth = this.appointment.birthDate.getUTCMonth() + 1; //months from 1-12
      this.birthDay = this.appointment.birthDate.getUTCDate();
      this.birthYear = this.appointment.birthDate.getUTCFullYear();


      this.appointment.investigationDate = new Date(this.appointment.investigationDate);
      this.investigationMonth = this.appointment.investigationDate.getUTCMonth() + 1; //months from 1-12
      this.investigationDay = this.appointment.investigationDate.getUTCDate();
      this.investigationYear = this.appointment.investigationDate.getUTCFullYear();

    }, error =>{
      this.doLogOut();
    });

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

    if(!this.validatePrincipalVariables() || !this.validateSociodemographicVariables() 
      || !this.validateLifeHabitsVariables() || !this.validateClinicalVariables()){
        this.setAlertodal();
    }else if(!this.vitaminFieldValidated && !this.hbA1cValidated &&
      !this.seasonValidated && !this.genderValidated &&
      !this.studyLevelValidated && !this.birthDateValidated &&
      !this.economicLevelValidated && !this.tobaccoValidated &&
      !this.alcoholRiskValidated && !this.sunExposureValidated &&
      !this.spfCreamValidated && !this.spfGradeValidated &&
      !this.exerciseValidated && !this.DM2Validated &&
      !this.glucoseValidated && !this.imcValidated &&
      !this.obesityValidated && !this.tasValidated &&
      !this.tadValidated && !this.arterialHypertensionValidated &&
      !this.cholesterolValidated && !this.ldlValidated &&
      !this.hdlValidated && !this.tgValidated &&
      !this.dyslipidemiaValidated && !this.creatinineValidated &&
      !this.glomerularValidated && !this.fototypeValidated &&
      !this.kidneyInsufficiencyValidated && !this.diabetesTreatmentValidated &&
      !this.vitaminDSupplementationValidated
    ){
      this.setAlertodal();
      this.alertMessage = "No se a rellenado ningún campo que modificar"
    }
    else{
      this.setWarningSaveModal();
    }
  }

  doHome(){
    this.router.navigate(['/admin/appointments']);
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

    if(this.form.vitaminaD.value != undefined && this.form.vitaminaD.value != "" && !this.vitaminFieldValidated){
      this.alertMessage = "campo vitamina D erróneo";
      return false;
    }
    if(this.form.HbA1c.value != undefined && this.form.HbA1c.value != "" && !this.hbA1cValidated){
      this.alertMessage = "campo hbA1c erróneo";
      return false;
    }
   
    return true;
  }

  validateSociodemographicVariables(): boolean{

    if(this.form.studies.value !== undefined){
      this.studyLevelValidated = true;
    }
    else{
      this.studyLevelValidated = false;
    }

    if(this.form.economicLevel.value !== undefined){
      this.economicLevelValidated = true;
    }
    else{
      this.economicLevelValidated = false;
    }

    if(this.form.bornDate.value != undefined){
      this.birthDateValidated = this.validateBirthDate(this.form.bornDate.value);
      if(this.form.bornDate.value != "" && !this.birthDateValidated){
        this.alertMessage = "campo fecha de nacimiento erróneo";
        return false;
      }
    }

    return true;
  }

  validateLifeHabitsVariables(): boolean{

    if(this.form.gradeSPF.value !== undefined){
      this.spfGradeValidated = true;
    }
    else{
      this.spfGradeValidated = false;
    }

    if(this.form.solarExposition.value != undefined && this.form.solarExposition.value != "" && !this.sunExposureValidated){
      this.alertMessage = "campo exposición solar erróneo";
      return false;
    }
    if(this.form.exercise.value != undefined && this.form.exercise.value != "" && !this.exerciseValidated){
      this.alertMessage = "campo ejercicio físico erróneo";
      return false;
    }

    return true;
  }
 
  validateClinicalVariables(): boolean{

    if(this.form.fototype.value !== undefined){
      this.fototypeValidated = true;
    }
    else{
      this.fototypeValidated = false;
    }
    
    if(this.form.bloodGlucose.value != undefined && this.form.bloodGlucose.value != "" && !this.glucoseValidated){
      this.alertMessage = "campo glucemia erróneo";
      return false;
    }
    if(this.form.IMC.value != undefined && this.form.IMC.value != "" && !this.imcValidated){
      this.alertMessage = "campo IMC erróneo";
      return false;
    }
    if(this.form.TAS.value != undefined && this.form.TAS.value != "" && !this.tasValidated){
      this.alertMessage = "campo tas erróneo";
      return false;
    }
    if(this.form.TAD.value != undefined && this.form.TAD.value != "" && !this.tadValidated){
      this.alertMessage = "campo tad erróneo";
      return false;
    }
    if(this.form.cholesterol.value != undefined && this.form.cholesterol.value != "" && !this.cholesterolValidated){
      this.alertMessage = "campo colesterol erróneo";
      return false;
    }
    if(this.form.LDL.value != undefined && this.form.LDL.value != "" && !this.ldlValidated){
      this.alertMessage = "campo ldl erróneo";
      return false;
    }
    if(this.form.HDL.value != undefined && this.form.HDL.value != "" && !this.hdlValidated){
      this.alertMessage = "campo hdl erróneo";
      return false;
    }
    if(this.form.TG.value != undefined && this.form.TG.value != "" && !this.tgValidated){
      this.alertMessage = "campo tg erróneo";
      return false;
    }
    if(this.form.creatinine.value != undefined && this.form.creatinine.value != "" && !this.creatinineValidated){
      this.alertMessage = "campo creatinina erróneo";
      return false;
    }
    if(this.form.glomerular.value != undefined && this.form.glomerular.value != "" && !this.glomerularValidated){
      this.alertMessage = "campo filtrado glomerular erróneo";
      return false;
    }

    return true;
  }

  doUpdate(){
    this.appointmentToUpdate.id = this.activatedRoute.snapshot.params.investigationsDetailsId;

    if(this.vitaminFieldValidated){
      this.appointmentToUpdate.vitaminD = this.form.vitaminaD.value;
    }else{
      this.appointmentToUpdate.vitaminD = this.appointment.vitaminD;
    }

    if(this.hbA1cValidated){
      this.appointmentToUpdate.hba1c = this.form.HbA1c.value;
    }else{
      this.appointmentToUpdate.hba1c = this.appointment.hba1c;
    }

    if(this.seasonValidated){
      this.appointmentToUpdate.season = this.form.season.value;
    }else{
      this.appointmentToUpdate.season = this.appointment.season;
    }

    if(this.genderValidated){
      this.appointmentToUpdate.gender = this.form.gender.value;
    }else{
      this.appointmentToUpdate.gender = this.appointment.gender;
    }

    if(this.studyLevelValidated){
      this.appointmentToUpdate.studyLevel = this.form.studies.value;
    }else{
      this.appointmentToUpdate.studyLevel = this.appointment.studyLevel;
    }

    if(this.birthDateValidated){
      this.appointmentToUpdate.birthDate = this.form.bornDate.value;
    }else{
      this.appointmentToUpdate.birthDate = this.appointment.birthDate;
    }

    if(this.economicLevelValidated){
      this.appointmentToUpdate.socioeconomicLevel = this.form.economicLevel.value;
    }else{
      this.appointmentToUpdate.socioeconomicLevel = this.appointment.socioeconomicLevel;
    }

    if(this.tobaccoValidated){
      this.appointmentToUpdate.tobacco = this.form.smoking.value;
    }else{
      this.appointmentToUpdate.tobacco = this.appointment.tobacco;
    }

    if(this.alcoholRiskValidated){
      this.appointmentToUpdate.riskalcohol = this.form.alcohol.value;
    }else{
      this.appointmentToUpdate.riskalcohol = this.appointment.riskalcohol;
    }

    if(this.sunExposureValidated){
      this.appointmentToUpdate.solarExposure = this.form.solarExposition.value;
    }else{
      this.appointmentToUpdate.solarExposure = this.appointment.solarExposure;
    }

    if(this.spfCreamValidated){
      this.appointmentToUpdate.spfCream = this.form.creamSPF.value;
    }else{
      this.appointmentToUpdate.spfCream = this.appointment.spfCream;
    }

    if(this.spfGradeValidated){
      this.appointmentToUpdate.spfScore = this.form.gradeSPF.value;
    }else{
      this.appointmentToUpdate.spfScore = this.appointment.spfScore;
    }

    if(this.exerciseValidated){
      this.appointmentToUpdate.exercise = this.form.exercise.value;
    }else{
      this.appointmentToUpdate.exercise = this.appointment.exercise;
    }

    if(this.DM2Validated){
      this.appointmentToUpdate.dm2 = this.form.DM2.value;
    }else{
      this.appointmentToUpdate.dm2 = this.appointment.dm2;
    }

    if(this.glucoseValidated){
      this.appointmentToUpdate.glucose = this.form.bloodGlucose.value;
    }else{
      this.appointmentToUpdate.glucose = this.appointment.glucose;
    }

    if(this.imcValidated){
      this.appointmentToUpdate.imc = this.form.IMC.value;
    }else{
      this.appointmentToUpdate.imc = this.appointment.imc;
    }

    if(this.obesityValidated){
      this.appointmentToUpdate.obesity = this.form.obesity.value;
    }else{
      this.appointmentToUpdate.obesity = this.appointment.obesity;
    }

    if(this.tasValidated){
      this.appointmentToUpdate.tas = this.form.TAS.value;
    }else{
      this.appointmentToUpdate.tas = this.appointment.tas;
    }

    if(this.tadValidated){
      this.appointmentToUpdate.tad = this.form.TAD.value;
    }else{
      this.appointmentToUpdate.tad = this.appointment.tad;
    }

    if(this.arterialHypertensionValidated){
      this.appointmentToUpdate.arterialHypertension = this.form.arterialHypertension.value;
    }else{
      this.appointmentToUpdate.arterialHypertension = this.appointment.arterialHypertension;
    }

    if(this.cholesterolValidated){
      this.appointmentToUpdate.cholesterol = this.form.cholesterol.value;
    }else{
      this.appointmentToUpdate.cholesterol = this.appointment.cholesterol;
    }

    if(this.ldlValidated){
      this.appointmentToUpdate.ldl = this.form.LDL.value;
    }else{
      this.appointmentToUpdate.ldl = this.appointment.ldl;
    }

    if(this.hdlValidated){
      this.appointmentToUpdate.hdl = this.form.HDL.value;
    }else{
      this.appointmentToUpdate.hdl = this.appointment.hdl;
    }

    if(this.tgValidated){
      this.appointmentToUpdate.tg = this.form.TG.value;
    }else{
      this.appointmentToUpdate.tg = this.appointment.tg;
    }

    if(this.dyslipidemiaValidated){
      this.appointmentToUpdate.dyslipemy = this.form.dyslipidemia.value;
    }else{
      this.appointmentToUpdate.dyslipemy = this.appointment.dyslipemy;
    }

    if(this.dyslipidemiaValidated){
      this.appointmentToUpdate.dyslipemy = this.form.dyslipidemia.value;
    }else{
      this.appointmentToUpdate.dyslipemy = this.appointment.dyslipemy;
    }

    if(this.creatinineValidated){
      this.appointmentToUpdate.creatinine = this.form.creatinine.value;
    }else{
      this.appointmentToUpdate.creatinine = this.appointment.creatinine;
    }

    if(this.glomerularValidated){
      this.appointmentToUpdate.glomerular = this.form.glomerular.value;
    }else{
      this.appointmentToUpdate.glomerular = this.appointment.glomerular;
    }

    if(this.kidneyInsufficiencyValidated){
      this.appointmentToUpdate.kidneyInsufficiency = this.form.chronicRenalFailure.value;
    }else{
      this.appointmentToUpdate.kidneyInsufficiency = this.appointment.kidneyInsufficiency;
    }

    if(this.fototypeValidated){
      this.appointmentToUpdate.fototype = this.form.fototype.value;
    }else{
      this.appointmentToUpdate.fototype = this.appointment.fototype;
    }

    if(this.diabetesTreatmentValidated){
      this.appointmentToUpdate.diabetesTreatment = this.form.diabetesTreatment.value;
    }else{
      this.appointmentToUpdate.diabetesTreatment = this.appointment.diabetesTreatment;
    }

    if(this.vitaminDSupplementationValidated){
      this.appointmentToUpdate.vitaminDSupplementation = this.form.vitaminDSupplementation.value;
    }else{
      this.appointmentToUpdate.vitaminDSupplementation = this.appointment.vitaminDSupplementation;
    }

    this.adminService.updateAppointmentDetails(this.appointmentToUpdate).subscribe(responseData =>{

      this.router.navigate(['/admin/appointments']);

    }, error =>{
        this.alertMessage = "Fallo en el servidor";
    });
  
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
}
