import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserToUpdatePass } from 'src/app/models/UserToUpdatePass';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResearcherServiceService } from 'src/app/services/researcher/researcher-service.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userLogged: User;

  updatePass: boolean = false;
  updateForm: FormGroup;

  errorText: boolean = false;
  alertMessage: string = "";
  succesModal: boolean = false;
  updatedModal: boolean = false;

  oldPassIsChecked: boolean = false;
  passIsChecked: boolean = false;
  passRepeatIsChecked: boolean = false;

  constructor(private router: Router,
    private researcherService: ResearcherServiceService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.userLogged = JSON.parse(localStorage.getItem("userLogged"));
    this.checkUserLogged();

    this.updateForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      password: ['', Validators.required],
      repeatedPassword: ['', Validators.required]
    });
  }

  get form() { return this.updateForm.controls; }

  doHome() {
    this.router.navigate(['/researcher/' + this.userLogged.id]);
  }

  doProfile() {
    this.router.navigate(['/researcher/profile/' + this.userLogged.id]);
  }

  doLogOut() {
    localStorage.removeItem('userLogged');
    this.router.navigate(['/login']);
  }


  doAdminView() {
    this.router.navigate(['/admin/researchers']);
  }


  checkUserLogged() {
    let id = this.route.snapshot.paramMap.get('id');

    if (id != this.userLogged.id) {
      this.doLogOut();
    }
  }

  changeShowOldPass() {
    this.oldPassIsChecked = !this.oldPassIsChecked;
  }

  changeShowPass() {
    this.passIsChecked = !this.passIsChecked;
  }

  changeShowPassRepeat() {
    this.passRepeatIsChecked = !this.passRepeatIsChecked;
  }

  showUpdateBox() {
    this.updatePass = !this.updatePass;
  }

  doUpdatePass() {

    if (this.form.password.value == undefined || this.form.password.value == "") {
      this.alertMessage = "No se ha introducido una nueva contraseña"
      this.errorText = true;
    } else if (this.form.repeatedPassword.value == undefined || this.form.repeatedPassword.value == "") {
      this.alertMessage = "No se ha introducido una repetición de la contraseña"
      this.errorText = true;
    } else if (this.form.password.value.trim() != this.form.repeatedPassword.value.trim()) {
      this.alertMessage = "La nueva contraseña y su repetición no coinciden"
      this.errorText = true;
    } else {
      this.errorText = false;
      this.succesModal = true;
    }
  }

  doUpdate() {
    let userToUpdate: UserToUpdatePass = new UserToUpdatePass;

    userToUpdate.id = this.userLogged.id;
    userToUpdate.oldPassword = this.form.oldPassword.value.trim();
    userToUpdate.newPassword = this.form.password.value.trim();

    let observable = this.researcherService.updatePassword(userToUpdate);
    if (observable === null) {
      this.router.navigate(['/login']);
    }
    else {
      observable.subscribe(responseData => {
        this.updatedModal = true;
        this.succesModal = false;
        this.alertMessage = "Contraseña modificada";
      }, error => {
        this.errorText = true;
        this.succesModal = false;
        if (error.status === 404) {
          this.alertMessage = "Usario no encontrado";
        }
        if (error.status === 409) {
          this.alertMessage = "La antigua contraseña no coincide";
        }
        if (error.status === 400) {
          this.alertMessage = "Datos incorrectos";
        }
        else {
          this.alertMessage = "Fallo en el servidor";
        }
      });
    }
  }

  setInvisibleModal() {
    this.succesModal = false;
  }

}
