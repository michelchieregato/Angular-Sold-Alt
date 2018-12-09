import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../models/product.model';
import 'rxjs-compat/add/operator/map';
import {Client} from '../models/client.model';

declare const window: any;
const { remote } = window.require('electron');

@Injectable({providedIn: 'root'})
export class ClientService {
    constructor(private http: HttpClient) {}


    login(auth: {}) {
        return this.http.post(remote.getGlobal('default_url') + 'login/', auth);
    }

    getProducts() {
        return this.http.get<Product[]>(remote.getGlobal('default_url') + 'product/').map(
            (response) => {
                return response.map(p => new Product(p));
            }
        );
    }

    getClients(query: string) {
        return this.http.get<Client[]>(remote.getGlobal('default_url') + 'client/?search=' + query).map(
            (response) => {
                return response.map(p => new Client(p));
            }
        );
    }
}
