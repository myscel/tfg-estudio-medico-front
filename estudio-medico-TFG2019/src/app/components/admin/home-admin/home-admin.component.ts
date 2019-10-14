import { Component, OnInit, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from 'src/app/services/userService.service';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { User } from 'src/app/models/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css'
]
})
export class HomeAdminComponent implements OnInit {

  @Input() researchers: User[] = [];


  userLogged: User;
  registerForm: FormGroup;
  alertHidden: boolean = false;
  errorMessage: string;

  inputName: string;
  inputSurname: string;
  inputMyDni: string;
  inputPass: string;
  inputPassRepeat: string;

  constructor(private router: Router,
              private http: HttpClient,
              private userService: UserServiceService,
              private adminService: AdminServiceService,
              private formBuilder: FormBuilder) { 
  }


  ngOnInit() {

    this.alertHidden = false;
    this.inputName = "";
    this.inputSurname= "";
    this.inputMyDni= "";
    this.inputPass= "";
    this.inputPassRepeat= "";

    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));

    let observable = this.adminService.getAllResearchers();

    if(observable === null){
      this.router.navigate(['/login']);
    }

    else{
      observable.subscribe(response =>{


        this.researchers = response.list;


      }, error =>{
        //Debería mostrar un pop-up
        console.log("Error al listar usuarios");
        console.log(error);
        this.router.navigate(['/login']);
      });
    }

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      dni: ['', Validators.required],
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required],
      gender: ['', Validators.required]
  });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    if(!this.checkEmptyFields()){
      this.alertHidden = true;
      this.errorMessage = "Rellena todos los campos";
    }
    else{
      var userInfo: User = new User();
      userInfo.username = this.f.dni.value;
      userInfo.password = this.f.password.value;
      userInfo.name =  this.f.name.value + ' ' + this.f.lastname.value;
      userInfo.gender = this.f.gender.value;
  
      this.registerResearcher(userInfo);
    }
  }

  checkEmptyFields(): boolean{
    if(this.f.dni.value.trim() === "" || 
      this.f.password.value.trim() === "" ||
      this.f.passwordRepeat.value.trim() === "" ||
      this.f.name.value.trim() === "" ||
      this.f.lastname.value.trim() === "" ||
      this.f.gender.value.trim() === ""){
      return false;
    }

    return true;
  }

  registerResearcher(user: User){
      
    console.log(user);

    this.alertHidden = false;

    let observable = this.adminService.registerResearcher(user);

    if(observable === null){
      this.router.navigate(['/login']);
    }
    else{
      observable.subscribe(responseData =>{
        let userRegistered: User = responseData;
        this.researchers.push(userRegistered);
        this.inputName = "";
        this.inputSurname= "";
        this.inputMyDni= "";
        this.inputPass= "";
        this.inputPassRepeat= "";

      }, error =>{
        this.alertHidden = true;
        if(error.status === 409){
          this.errorMessage = "Ya existe un usuario con el mismo dni";
        }
        else{
          this.errorMessage = "Fallo en el servidor";
        } 
      });
    }
  }


  deleteResearcher(username: string){

    this.alertHidden = false;
    this.inputName = "";
    this.inputSurname= "";
    this.inputMyDni= "";
    this.inputPass= "";
    this.inputPassRepeat= "";

    this.adminService.deleteResearcher(username).subscribe(responseData =>{

      console.log("Investigador eliminado correctamente: " + username);
      
      this.adminService.getAllResearchers().subscribe(response =>{
        this.researchers = response.list;
      });
      
      
    }, err => {
      console.log("Error en el eliminar investigador");
      console.log(err);

    });
  }

  doLogOut(){
    this.userService.logOutResearcherAndAdmin().subscribe(responseData =>{
      console.log("Iniciando Log out");
      console.log(responseData);
      localStorage.removeItem('userLogged');
      this.router.navigate(['/login']);

    }, err => {
      console.log("Error en el logout");
      console.log(err);
 
    });
  }

}
