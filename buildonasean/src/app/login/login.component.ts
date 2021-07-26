import { Component, OnInit } from '@angular/core';
import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import { Router } from '@angular/router';
// import { LoginService } from '../login.service'
import amplify from '../aws-exports';
import { SignInOpts } from '@aws-amplify/auth/lib-esm/types';
import { LoginService } from '../login.service';

Auth.configure(amplify);

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    error: Boolean = false;

    constructor(private router: Router, private loginService: LoginService) { }

    ngOnInit(): void {
      this.loginService.getCurrentUser().then(user => {
        this.loginService.authenticated(true);
        console.log("You are logged in!");
        this.router.navigate(['/dashboard']);
      }).catch(() => {
        console.log("Not Logged In");
      }) ;

      this.error = false;
    }

  // singUpToAWS(email: HTMLInputElement,contactNo: HTMLInputElement,username: HTMLInputElement,password: HTMLInputElement) {
    
  //   this.userName = username.value;

  //   const user = {
  //     username: username.value,
  //     password: password.value,
  //     attributes: {
  //         email: email.value,          // optional
  //         phone_number: contactNo.value,   // optional - E.164 number convention
  //         // other custom attributes 
  //     }
  //   }

    
  //   Auth.signUp(user)
  //     .then(data => {
  //       console.log(data);
  //       this.toVerifyEmail = true;
  //       this.signstatus = "";
  //     })
  //     .catch(err => console.log(err));
  
  // // Auth.resendSignUp(username).then(() => {
  // //     console.log('code resent successfully');
  // // }).catch(e => {
  // //     console.log(e);
  // // });

  // }

  // onVerify(verifycode: HTMLInputElement) {
  //   // After retrieving the confirmation code from the user
  //   Auth.confirmSignUp(this.userName, verifycode.value, {
  //     // Optional. Force user confirmation irrespective of existing alias. By default set to True.
  //     forceAliasCreation: true    
  //     }).then(data => {
  //       console.log(data)
  //       this.toVerifyEmail = false;
  //       this.signstatus = 'signin'
  //     })
  //       .catch(err => console.log(err));
  // }

  signInToAWS(username: HTMLInputElement, password: HTMLInputElement ) {

    const authInfo = {
      username: username.value,
      password: password.value
    }

    Auth.signIn(authInfo).then(user => {
      this.router.navigate(['/dashboard'])
    })
      .catch(err => {
        this.error = true;
      });

  }

}

