import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { FormBuilder } from '@angular/forms';
import { User } from 'src/app/models/User';
import { UserServiceService } from 'src/app/services/userService.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-researcher-admin',
  templateUrl: './edit-researcher-admin.component.html',
  styleUrls: ['./edit-researcher-admin.component.css']
})
export class EditResearcherAdminComponent implements OnInit {

  @Input() researcher: User = new User();
  userLogged: User;

  public id: string;

  constructor(private router: Router,
    private http: HttpClient,
    private adminService: AdminServiceService,
    private userService: UserServiceService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));

    this.id = this.route.snapshot.paramMap.get('id');
    console.log("El id de la ruta es: " + this.id);

    let observable = this.adminService.getResearcherByID(this.id);

    if(observable === null){
      this.router.navigate(['/login']);
    }

    else{
      observable.subscribe(response =>{
        this.researcher = response;
        console.log("Investigador cargado correctamente");
        console.log(this.researcher);

      }, error =>{
        console.log("Error al cargar el investigador");
        //CAMBIAR
        //this.router.navigate(['/login']);
      });
    }
    

    
  }

  doLogOut(){
    this.userService.logOutResearcherAndAdmin().subscribe(responseData =>{
      localStorage.removeItem('userLogged');
      this.router.navigate(['/login']);

    });
  }

}
