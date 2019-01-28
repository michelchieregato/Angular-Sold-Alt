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
let user = remote.getGlobal('user');

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

    getStockProduct(id: number) {
        return this.http.get(remote.getGlobal('default_url') + 'product/' + id + '/');
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
        user = remote.getGlobal('user');
        sale['user'] = user.id;
        sale['store'] = store;
        return this.http.post(remote.getGlobal('default_url') + 'sale/', sale).map(
            (response) => {
                return response;
            }
        );
    }

    updateSaleFromOrder(sale: any) {
        user = remote.getGlobal('user');
        sale['user'] = user.id;
        sale['store'] = store;
        return this.http.put(remote.getGlobal('default_url') + 'sale/' + sale.id + '/', sale);
    }

    getSales(params: any) {
        if (!params.store) {
            params.store = store;
        } else if (params.store === 'Todas') {
            params['store'] = '';
        }
        return this.http.get<Sale[]>(remote.getGlobal('default_url') + 'sale/', {params: params}).map(
            (response) => {
                return response.map(p => new Sale(p));
            }
        );
    }

    getSale(id: number) {
        return this.http.get(remote.getGlobal('default_url') + 'sale/' + id + '/');
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
        user = remote.getGlobal('user');
        params['store'] = store;
        params['user'] = user.id;
        return this.http.post(remote.getGlobal('default_url') + 'withdraw_history/', params);
    }

    getWithdrawHistory(page: number, params: any) {
        params['store'] = store;
        return this.http.get(remote.getGlobal('default_url') + 'withdraw_history/?page=' + page,
            {params: params}).map(
            (next) => {
                console.log(next);
                return next['results'];
            }
        );
    }

    updateStock(params: any) {
        user = remote.getGlobal('user');
        params['from_store'] = store;
        params['user'] = user.id;
        return this.http.patch(remote.getGlobal('default_url') + 'store_product/', params);
    }

    getReportByPayments(params: any) {
        params['store'] = store;
        return this.http.get(remote.getGlobal('default_url') + 'reports/report_by_payment', {params: params});
    }

    getReportByProduct(params: any) {
        params['store'] = store;
        return this.http.get(remote.getGlobal('default_url') + 'reports/report_by_products', {params: params});
    }

}
