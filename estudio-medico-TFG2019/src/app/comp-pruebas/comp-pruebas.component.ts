import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comp-pruebas',
  templateUrl: './comp-pruebas.component.html',
  styleUrls: ['./comp-pruebas.component.css']
})
export class CompPruebasComponent implements OnInit {

  allowNewServer:boolean = false;
  serverId: number = 4;
  status: string = "offline";
  serverCreationStatus: string = "No server was created!! :Q";
  serverName: string = "";

  constructor() { 
    setTimeout(() =>{
      this.allowNewServer = true;
    }, 2000)
  }

  ngOnInit() {
  }


  onCreateServer(){
    this.serverCreationStatus = "Server was created! :D"
  }

  onUpdateServerName(event: any){
      this.serverName = event.target.value;
  }

}
