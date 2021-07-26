 
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { Subject } from 'rxjs';


@Injectable()
export class LoginService {

    private authenticatedSource: Subject<Boolean> = new Subject<Boolean>();

    authenticated$ = this.authenticatedSource.asObservable();

    constructor(public router: Router) {
    }

    public getCurrentUser() {
        return Auth.currentAuthenticatedUser();
    }

    authenticated(auth: Boolean) {
        this.authenticatedSource.next(auth);
    }

    public getProfile() {
        return Auth.currentAuthenticatedUser();
    }

    public retrieveIdToken() {
        return Auth.currentCredentials();
    }

    public retrieveAccessToken() {
        return Auth.currentCredentials();
    }
}
