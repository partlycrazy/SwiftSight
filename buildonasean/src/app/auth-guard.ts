import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import Auth from '@aws-amplify/auth';
import { LoginService } from './login.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor( private _router: Router, private loginService: LoginService ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      // this.loginService.signNewUser();
      return this.loginService.isLoggedIn();

    // return Auth.currentAuthenticatedUser().then(() => { 
    //   console.log("Allowed");
    //   return true; 
    // }).catch(() => {
    //     Auth.federatedSignIn();
    //     console.log("Trying federated sign in");
    //     this._router.navigate(['/']);
    //     return false;
    //   });
  }
  
}
