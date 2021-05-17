import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
}

@Injectable({providedIn: 'root'})

export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {}

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCvL0Ove3e1iOoPn1NV60OWtq79Rg7s7_M', {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(resData.email,  resData.idToken, resData.localId, +resData.expiresIn);
        }));
    }

    signin(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCvL0Ove3e1iOoPn1NV60OWtq79Rg7s7_M', {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(resData.email, resData.idToken, resData.localId, +resData.expiresIn);
        }));
    }

    logout() {
        // set user to null
        this.user.next(null);
        this.router.navigate(['/auth'])
        localStorage.removeItem('userData');
        clearTimeout(this.tokenExpirationTimer);
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration)
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred';
            if(!errorResponse.error || !errorResponse.error.error) {
                return throwError(errorMessage);
            }
            switch(errorResponse.error.error.message) {
                case 'EMAIL_EXISTS': 
                    errorMessage = 'This email exists already';
                    break;
                  case 'EMAIL_NOT_FOUND': 
                    errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
                    break;
                  case 'INVALID_PASSWORD':
                    errorMessage = 'The password is invalid or the user does not have a password.';
                    break;
              }
            return throwError(errorMessage)
    }

    autoLogin() {  
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: Number
        } = JSON.parse(localStorage.getItem('userData'));
        console.log(userData);
        if(!userData) {
            return;
        }
        const loadedUser = new User(userData.email,userData._token, userData.id, new Date(+userData._tokenExpirationDate))
        console.log(loadedUser);
        if(loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(+userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        } else {
            console.log('user invalid');
        }
    }

    private handleAuthentication(email: string, token: string, userId: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
            const user = new User(email, token, userId, expirationDate);
            this.user.next(user);
            this.autoLogout(expiresIn * 1000);
            // set user to localstorage as a string
            localStorage.setItem('userData', JSON.stringify(user));
    }
}