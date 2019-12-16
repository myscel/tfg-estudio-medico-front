import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  userLogged: User;
  subjectForm: FormGroup;

  constructor(private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder) { }

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
    console.log(this.form);
  }

  doHome() {
    this.router.navigate(['/researcher']);
  }
}
