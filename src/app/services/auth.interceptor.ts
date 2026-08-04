import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {SessionService} from './session.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private session: SessionService, private router: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.session.getToken();
        if (token) {
            req = req.clone({setHeaders: {Authorization: 'Token ' + token}});
        }

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                // 401 do próprio login é senha errada — tratado pela tela de login
                if (error.status === 401 && !req.url.endsWith('login/')) {
                    this.session.clear();
                    this.router.navigate(['/']);
                }
                return throwError(error);
            })
        );
    }
}
