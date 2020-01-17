import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';

@Injectable({
  providedIn: 'root'
})
export class GuardServiceService implements CanActivate {

  constructor(private router: Router) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{;
    let userLogged: User = JSON.parse(localStorage.getItem("userLogged"));
  
    if(userLogged === null){
      localStorage.removeItem('userLogged');
      this.router.navigate(['/login']);
    }

    return true;
  }

  
}
