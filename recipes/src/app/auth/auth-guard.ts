import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
// prevents users from access routes without authentication
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService){}

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
        return this.authService.user.pipe(map(user => {
            return !!user;
        }));
    }
}