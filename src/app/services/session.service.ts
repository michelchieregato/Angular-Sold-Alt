import {Injectable} from '@angular/core';
import {User} from '../models/user.model';
import {School} from '../models/enum';
import {
    clearSession,
    getSessionSchool,
    getSessionStore,
    getSessionToken,
    getSessionUser,
    setSessionSchool,
    setSessionStore,
    setSessionToken,
    setSessionUser,
} from '../session-storage';

@Injectable({providedIn: 'root'})
export class SessionService {

    getToken(): string {
        return getSessionToken();
    }

    setToken(token: string) {
        setSessionToken(token);
    }

    getUser(): User {
        return new User(getSessionUser());
    }

    setUser(user: User) {
        setSessionUser(user);
    }

    getStore(): string {
        return getSessionStore();
    }

    setStore(store: string) {
        setSessionStore(store);
    }

    getSchool(): School {
        return getSessionSchool();
    }

    setSchool(school: School) {
        setSessionSchool(school);
    }

    isLoggedIn(): boolean {
        return !!getSessionToken();
    }

    clear() {
        clearSession();
    }
}
