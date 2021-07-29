 
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { Subject } from 'rxjs';

@Injectable()
export class LoginService {

    private authenticatedSource: Subject<Boolean> = new Subject<Boolean>();
    authenticated$ = this.authenticatedSource.asObservable();

    hospitalID: number;
    loggedIn: boolean;

    constructor(public router: Router) {
    }

    public getCurrentUser() {
        return Auth.currentAuthenticatedUser();
    }

    // async signNewUser() {
    //     await Auth.signUp({
    //         username: 'admin',
    //         password: 'winningstrix'
    //     ,
    //     attributes: {
    //         email: 'admin@swiftsight.com',
    //         'custom:hospital_id': '0'
    //         }
    //     })
    // }

    async isLoggedIn() {
        const user = await Auth.currentAuthenticatedUser();
        if (user) {
            this.hospitalID = user.attributes['custom:hospital_id'];
            this.authenticated(true);
            return true;
        }
        this.authenticated(false);
        return false;
    }

    // async updateUser(id: string) {
    //     const user = await Auth.currentAuthenticatedUser();
    //     await Auth.updateUserAttributes(user, {
    //         'custom:hospital_id': id
    //     })
    // }

    public signout() {
        Auth.signOut()
        .then(data => {
            console.log(data);
            console.log("You are successfully logged out");
            this.authenticated(false);
            this.router.navigate(['/']);
        })
      .catch(err => console.log(err));
    }
    
    // async signIn(authInfo: any): boolean {
    //     Auth.signIn(authInfo).then(() => {
    //         this.router.navigate(['/dashboard'])
    //       })
    //         .catch(err => {
    //           return true;
    //         });
    // }

    async authenticated(auth: Boolean) {
        this.authenticatedSource.next(auth);    
    }
}