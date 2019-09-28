import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule }    from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HomeAdminComponent } from './components/home/home-admin/home-admin.component';
import { HomeInvestigatorComponent } from './components/home/home-investigator/home-investigator.component';

const appRoutes : Routes = [ 
  { path: '', component: LoginComponent },
  { path: 'homeAdmin', component: HomeAdminComponent },
  { path: 'homeInvestigator', component: HomeInvestigatorComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeAdminComponent,
    HomeInvestigatorComponent
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
