import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule }    from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HomeAdminComponent } from './components/admin/home-admin/home-admin.component';
import { HomeResearcherComponent } from './components/researcher/home-researcher/home-researcher.component';
import { SubjectsAdminComponent } from './components/admin/subjects-admin/subjects-admin.component';
import { FormComponent } from './components/form/form.component';
import { ProfileComponent } from './components/researcher/profile/profile.component';
import { EditResearcherAdminComponent } from './components/admin/edit-researcher-admin/edit-researcher-admin.component';

const appRoutes : Routes = [ 
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/researchers', component: HomeAdminComponent },
  { path: 'admin/subjects', component: SubjectsAdminComponent },
  { path: 'admin/researchers/edit/:id', component: EditResearcherAdminComponent},
  { path: 'researcher', component: HomeResearcherComponent },
  { path: 'researcher/subjectForm/:idSubject/:appointment', component: FormComponent },
  { path: 'researcher/profile/:id', component: ProfileComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeAdminComponent,
    HomeResearcherComponent,
    SubjectsAdminComponent,
    FormComponent,
    ProfileComponent,
    EditResearcherAdminComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(appRoutes) 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
