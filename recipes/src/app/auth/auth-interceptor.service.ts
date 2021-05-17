import { Injectable } from "@angular/core";
import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { AuthService } from "./auth.service";
import { exhaustMap, take } from "rxjs/operators";

@Injectable()
// sets token for all outgoing requests
export class AuthInterceptorService {

    constructor(private authService:  AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // watches for new user via user subject in auth.service
        return this.authService.user.pipe(take(1), exhaustMap(user => {
            if(!user) {
                return next.handle(req);
            } else {
                const modifiedReq = req.clone({params: new HttpParams().set('auth', user.token)});
                return next.handle(modifiedReq);
            }
        }))
    }
}