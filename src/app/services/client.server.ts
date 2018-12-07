import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs-compat/add/operator/map';
import {Product} from '../models/product.model';

declare const window: any;
const { remote } = window.require('electron');

@Injectable({providedIn: 'root'})
export class ClientServer {
    constructor(private http: HttpClient) {}


    login(auth: {}) {
        return this.http.post(remote.getGlobal('default_url') + 'login/', auth).map(
            (response) => {
                if (response['isAuth']) {
                    return response['Permission'];
                } else {
                    return false;
                }
            }
        );
    }

    getProducts() {
        return this.http.get<Product[]>(remote.getGlobal('default_url') + 'product/read').map(
            (response) => {
                return response.map(p => new Product(p));
            }
        );
    }

    saveProducts(product: Product) {
        return this.http.post(remote.getGlobal('default_url') + 'product/create', product);
    }
}
