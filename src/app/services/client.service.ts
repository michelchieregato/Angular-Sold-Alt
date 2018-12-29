import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../models/product.model';
import 'rxjs-compat/add/operator/map';
import {Client} from '../models/client.model';
import {Sale} from '../models/sale.model';
import {Withdraw} from '../models/withdraw.model';

declare const window: any;
const {remote} = window.require('electron');
const store = remote.getGlobal('store');
const user = remote.getGlobal('user');

@Injectable({providedIn: 'root'})
export class ClientService {
    constructor(private http: HttpClient) {
    }


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

    getSaleProducts(id: string) {
        return this.http.get(remote.getGlobal('default_url') + 'sale_product/', {params: {saleId: id}}).map(
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

    getSalePayments(id: string) {
        return this.http.get(remote.getGlobal('default_url') + 'payment/', {params: {saleId: id}}).map(
            (response) => {
                return response;
            }
        );
    }

    getWithdrawInformation(params: any) {
        params['store'] = store;
        return this.http.get(remote.getGlobal('default_url') + 'withdraw/0/', {params: params}).map(
            (response) => {
                return new Withdraw(response);
            }
        );
    }

    updateWithdraw(params: Withdraw) {
        return this.http.put(remote.getGlobal('default_url') + 'withdraw/' + params.id + '/', params);
    }

    createWithdrawHistory(params: any) {
        params['store'] = store;
        params['user'] = user.id;
        return this.http.post(remote.getGlobal('default_url') + 'withdraw_history/', params);
    }
}
