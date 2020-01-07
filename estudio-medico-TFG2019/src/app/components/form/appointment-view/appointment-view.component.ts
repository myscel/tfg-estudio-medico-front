import { Component, OnInit } from '@angular/core';
import { UserServiceService } from 'src/app/services/userService.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-appointment-view',
  templateUrl: './appointment-view.component.html',
  styleUrls: ['./appointment-view.component.css']
})
export class AppointmentViewComponent implements OnInit {

  userLogged: User;

  //Datos de la cita
  idSubject: string;
  appointmentDate: string;

  //Variables principales
  vitamin: string;
  hbA1c: string;
  season: string;

  //Variables sociodemográficas
  gender: string;
  studyLevel: string;
  birthDate: string;
  economicLevel: string;

  //Hábitos de vida
  tobacco: string;
  alcoholRisk: string;
  sunExposure: string;
  spfCream: string;
  spfGrade: string;
  exercise: string;

  //Variables clínicas
  DM2: string;
  glucose: string;
  imc: string;
  obesity: string;
  tas: string;
  tad: string;
  arterialHypertension: string;
  cholesterol: string;
  ldl: string;
  hdl: string;
  tg: string;
  dyslipidemia: string;
  creatinine: string;
  glomerular: string;
  kidneyInsufficiency: string;
  fototype: string;
  diabetesTreatment: string;
  vitaminDSupplementation: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserServiceService
  ) { }

  ngOnInit() {

    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));

    this.idSubject = this.activatedRoute.snapshot.params.idSubject;
  }

  doLogOut() {
    this.userService.logOutResearcherAndAdmin().subscribe(responseData => {
      localStorage.removeItem('userLogged');
      this.router.navigate(['/login']);
    });
  }

  doProfile() {
    this.router.navigate(['/researcher/profile/' + this.userLogged.id]);
  }

  doHome() {
    this.router.navigate(['/researcher/' + this.userLogged.id]);
  }

}
