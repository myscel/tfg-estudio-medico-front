import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule }    from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ResearchersAdminComponent } from './components/admin/researchers-admin/researchers-admin.component';
import { HomeResearcherComponent } from './components/researcher/home-researcher/home-researcher.component';
import { SubjectsAdminComponent } from './components/admin/subjects-admin/subjects-admin.component';
import { AppointmentComponent } from './components/form/appointment-questionary/appointment.component';
import { ProfileComponent } from './components/researcher/profile/profile.component';
import { EditResearcherAdminComponent } from './components/admin/edit-researcher-admin/edit-researcher-admin.component';
import { GuardServiceService } from './services/guard/guard-service.service';
import { TooltipModule } from 'ng2-tooltip-directive';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppointmentViewComponent } from './components/form/appointment-view/appointment-view.component';
import { AppointmentsAdminComponent } from './components/admin/appointments-admin/appointments-admin.component';
import { ModifyAppointmentComponent } from './components/admin/appointments-admin/modify-appointment/modify-appointment.component';

const appRoutes : Routes = [ 
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/researchers', component: ResearchersAdminComponent, canActivate: [GuardServiceService] },
  { path: 'admin/subjects', component: SubjectsAdminComponent, canActivate: [GuardServiceService] },
  { path: 'admin/appointments', component: AppointmentsAdminComponent, canActivate: [GuardServiceService] },
  { path: 'admin/researchers/edit/:id', component: EditResearcherAdminComponent, canActivate: [GuardServiceService]},
  { path: 'admin/modifyAppointment/:subjectIdentificationNumber/:investigationsDetailsId', component: ModifyAppointmentComponent, canActivate: [GuardServiceService] },
  { path: 'researcher/:id', component: HomeResearcherComponent, canActivate: [GuardServiceService] },
  { path: 'researcher/:id/subjectForm/:idSubject/:appointment', component: AppointmentComponent, canActivate: [GuardServiceService] },
  { path: 'researcher/:id/formView/:idSubject/:appointment', component: AppointmentViewComponent, canActivate: [GuardServiceService] },
  { path: 'researcher/profile/:id', component: ProfileComponent, canActivate: [GuardServiceService] }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResearchersAdminComponent,
    HomeResearcherComponent,
    SubjectsAdminComponent,
    AppointmentComponent,
    ProfileComponent,
    EditResearcherAdminComponent,
    AppointmentViewComponent,
    AppointmentsAdminComponent,
    ModifyAppointmentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    TooltipModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forRoot(appRoutes) 
  ],
  providers: [GuardServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
