import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '../authentication/authentication.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  menuItems = ['dashboard', 'supplier'];
  adminItems = ['settings', 'logout'];
  loggedIn: Boolean = false;
  
  subscription: Subscription;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private loginService: LoginService) {
    this.subscription = loginService.authenticated$.subscribe(auth => {
      this.loggedIn = auth;
    })
  }

  onLogOut() {
    this.loginService.signout();
  }

}
