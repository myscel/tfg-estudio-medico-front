import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'

import { AppComponent } from './app.component';
import { Comp1Component } from './components/comp1/comp1.component';
import { CompHTTPComponent } from './components/comp-http/comp-http.component';
import { HttpClientModule} from '@angular/common/http';
import { LoginCompComponent } from './components/home/login-comp/login-comp.component';
import { MainPageResearcherCompComponent } from './components/researcher/main-page-researcher-comp/main-page-researcher-comp.component';
import { MainPageAdminCompComponent } from './components/admin/main-page-admin-comp/main-page-admin-comp.component';

const allRoutes: Routes = [
  { path: '', component: LoginCompComponent},
  { path: 'login', component: LoginCompComponent},
  { path: 'researcher', component: MainPageResearcherCompComponent},
  { path: 'admin', component: MainPageAdminCompComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    Comp1Component,
    CompHTTPComponent,
    LoginCompComponent,
    MainPageResearcherCompComponent,
    MainPageAdminCompComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(allRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
