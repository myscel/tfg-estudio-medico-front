import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdminServiceService } from 'src/app/services/admin-service.service';
import { User } from 'src/app/models/User';
import { UserServiceService } from 'src/app/services/userService.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-researcher-admin',
  templateUrl: './edit-researcher-admin.component.html',
  styleUrls: ['./edit-researcher-admin.component.css']
})
export class EditResearcherAdminComponent implements OnInit {

  @Input() researcher: User = new User();
  userLogged: User;
  id: string;
  passIsChecked: boolean = false;
  passRepeatIsChecked: boolean = false;
  alertModifyHidden:boolean = false;
  successModifyHidden:boolean = true;
  errorMessage:string = "";
  successMessage:string = "";
  updateForm: FormGroup;

  constructor(private router: Router,
    private http: HttpClient,
    private adminService: AdminServiceService,
    private userService: UserServiceService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));

    this.id = this.route.snapshot.paramMap.get('id');

    let observable = this.adminService.getResearcherByID(this.id);

    if(observable === null){
      this.router.navigate(['/login']);
    }

    else{
      observable.subscribe(response =>{
        this.researcher = response;

      }, error =>{
        if(error.status === 404){
          console.log("El investigador no existe");
        }

        else if(error.status === 500){
          console.log("Fallo en el servidor");
        }
      });
    }
    
    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      password: ['', Validators.required],
      repeatedPassword: ['', Validators.required]
  }); 
  }

  get updateFields() { return this.updateForm.controls; }

  changeShowPass(){
    this.passIsChecked = !this.passIsChecked;
  }

  changeShowPassRepeat(){
    this.passRepeatIsChecked = !this.passRepeatIsChecked;
  }

  leaveUpdateResearcher(){
    this.router.navigate(['/admin/researchers']);
  }

  doLogOut(){
    this.userService.logOutResearcherAndAdmin().subscribe(responseData =>{
      localStorage.removeItem('userLogged');
      this.router.navigate(['/login']);

    });
  }

  doUpdate(){
    
    console.log(this.updateFields.name.value);
    console.log(this.updateFields.surname.value);
    console.log(this.updateFields.password.value);

  }

}
