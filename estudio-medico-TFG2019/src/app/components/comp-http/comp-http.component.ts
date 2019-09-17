import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from 'src/app/services/userService.service';

@Component({
  selector: 'app-comp-http',
  templateUrl: './comp-http.component.html',
  styleUrls: ['./comp-http.component.css']
})
export class CompHTTPComponent implements OnInit {

  dni: string = "47298046H";
  password: string = "pass2";

  constructor(private http: HttpClient, private userService: UserServiceService) { }

  ngOnInit() {
  }

  enviarPeticion(){
    return this.userService.createAndStoreUserPostLogin(this.dni, this.password).subscribe(responseData =>{
      console.log("Todo ha ido bien");
      console.log(responseData)
    }, err => {
      console.log("Algo ha fallado");
      console.log(err)
    });
  }

}
