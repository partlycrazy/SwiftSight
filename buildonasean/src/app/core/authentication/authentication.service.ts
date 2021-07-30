 
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable()
export class LoginService {

    private authenticatedSource: Subject<Boolean> = new Subject<Boolean>();
    authenticated$ = this.authenticatedSource.asObservable();

    private hospitalID: BehaviorSubject<number>;
    public loggedIn: boolean;

    constructor(public router: Router) { 
        this.hospitalID = new BehaviorSubject<number>(0);
    }

    public getCurrentUser() {
        return Auth.currentAuthenticatedUser();
    }

    public getCurrentHospitalId(): number {
        return this.hospitalID.value;
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
            console.log(user.attributes['custom:hospital_id']);
            this.hospitalID.next(user.attributes['custom:hospital_id']);
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
