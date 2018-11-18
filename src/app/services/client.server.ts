import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

declare const window: any;
const { remote } = window.require('electron');

@Injectable({providedIn: 'root'})
export class ClientServer {
    constructor(private http: HttpClient) {}


    login(auth: {}) {
        console.log(auth)
        return this.http.post(remote.getGlobal('default_url') + 'login/', auth);
    }
}
