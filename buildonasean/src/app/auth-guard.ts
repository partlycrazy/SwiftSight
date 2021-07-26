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

      return this.loginService.getCurrentUser().then(user => {
        console.log(user);
        this.loginService.authenticated(true);
        //this._router.navigate(['/dashboard']);   
        return true;
      }).catch(() => {
        this.loginService.authenticated(false);
        this._router.navigate(['/']);        
        return false;
      })

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
