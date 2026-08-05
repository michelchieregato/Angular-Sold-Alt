import {Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {SessionService} from './session.service';

@Injectable({providedIn: 'root'})
export class AdminGuard implements CanActivate {

    constructor(private session: SessionService, private router: Router) {
    }

    canActivate(): boolean | UrlTree {
        if (this.session.isLoggedIn() && this.session.getUser().is_admin) {
            return true;
        }
        return this.router.parseUrl('/seller/menu');
    }
}
