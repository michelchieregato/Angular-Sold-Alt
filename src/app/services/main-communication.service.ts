import {Injectable} from '@angular/core';
import {User} from '../models/user.model';

@Injectable({providedIn: 'root'})
export class MainCommunicationService {
    user: User;
    store: string;
    constructor() {
        this.store = 'Verbo Divino';
    }

    setUser(user: User) {
        this.user = user;
    }

    getUser() {
        return this.user;
    }

    getStore() {
        return this.store;
    }
}
