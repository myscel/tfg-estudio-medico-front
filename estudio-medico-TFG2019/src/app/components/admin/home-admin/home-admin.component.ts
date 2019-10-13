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

  constructor(private router: Router,
              private http: HttpClient,
              private userService: UserServiceService,
              private adminService: AdminServiceService,
              private formBuilder: FormBuilder) { 
  }


  ngOnInit() {

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
    var userInfo = { 
      name: this.f.name.value,
      lastaname: this.f.lastname.value,  
      dni: this.f.dni.value, 
      password: this.f.password.value,
      passwordRepeat: this.f.passwordRepeat.value,
      gender:this.f.gender.value  
   };
  }


  deleteResearcher(username: string){
    console.log("Borrando el investigador: " + username);

    this.adminService.deleteResearcher(username).subscribe(responseData =>{
      console.log("Investigador eliminado correctamente: " + responseData);

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
