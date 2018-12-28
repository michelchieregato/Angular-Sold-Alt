import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../models/product.model';
import 'rxjs-compat/add/operator/map';
import {Client} from '../models/client.model';
import {Sale} from '../models/sale.model';

declare const window: any;
const { remote } = window.require('electron');
const store = remote.getGlobal('store');

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
        return this.http.get<Client[]>(remote.getGlobal('default_url') + 'client/', {params: {'search': query}}).map(
            (response) => {
                return response.map(p => new Client(p));
            }
        );
    }

    saveClient(client: Client) {
        return this.http.post(remote.getGlobal('default_url') + 'client/', client);
    }

    finishSale(sale: any) {
        return this.http.post(remote.getGlobal('default_url') + 'sale/', sale).map(
            (response) => {
                return response;
            }
        );
    }

    getSales(params: any) {
        params['store'] = store;
        return this.http.get<Sale[]>(remote.getGlobal('default_url') + 'sale/', {params: params}).map(
            (response) => {
                return response.map(p => new Sale(p));
            }
        );
    }

    getSaleProducts(id: number) {
        return this.http.get<Sale[]>(remote.getGlobal('default_url') + 'sale_product/', {params: {saleId: id}}).map(
            (response) => {
                return response.map(p => {
                    const product = new Product(p.product);
                    product.quantity = p.quantity;
                    product.price_sell = p.value / p.quantity;
                    return product;
                });
            }
        );
    }

    getSalePayments(id: number) {
        return this.http.get<Sale[]>(remote.getGlobal('default_url') + 'payment/', {params: {saleId: id}}).map(
            (response) => {
                console.log(response)
                return response;
            }
        );
    }
}
