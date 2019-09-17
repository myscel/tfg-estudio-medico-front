import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-comp-http',
  templateUrl: './comp-http.component.html',
  styleUrls: ['./comp-http.component.css']
})
export class CompHTTPComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  enviarPeticion(){
    var postData = {
        "dni": "4728046H",
        "password" : "randomPass"
    }

    console.log(postData);

    //Send HTTP Request
    this.http.post('http://localhost:8080/user/login',  postData).subscribe(response =>{
      console.log(response)
    });

  }

}
