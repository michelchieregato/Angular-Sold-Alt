import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getProductsFromBackend, Product} from '../models/product.model';
import {Client} from '../models/client.model';
import {Sale} from '../models/sale.model';
import {Withdraw} from '../models/withdraw.model';
import {map} from 'rxjs/operators';
import {Trade} from '../models/trade.model';
import {SalePayments} from '../models/payment.model';

declare const window: any;
const {remote} = window.require('electron');
let store = remote.getGlobal('store');
let user = remote.getGlobal('user');

@Injectable({providedIn: 'root'})
export class ClientService {
    constructor(private http: HttpClient) {
    }

    login(auth: {}) {
        return this.http.post(remote.getGlobal('default_url') + 'login/', auth);
    }

    getProducts(full: any = false, old: any = true) {
        return this.http.get<Product[]>(remote.getGlobal('default_url') + 'product/', {params: {full, old}}).pipe(map(
            (response) => {
                return response.map(p => new Product(p));
            }
        ));
    }

    getStockProduct(id: number) {
        return this.http.get(remote.getGlobal('default_url') + 'product/' + id + '/');
    }

    getClients(query: string) {
        return this.http.get<Client[]>(remote.getGlobal('default_url') + 'client/', {params: {'search': query}}).pipe(map(
            (response) => {
                return response.map(p => new Client(p));
            })
        );
    }

    saveClient(client: Client) {
        return this.http.post(remote.getGlobal('default_url') + 'client/', client);
    }

    finishSale(sale: any) {
        user = remote.getGlobal('user');
        store = remote.getGlobal('store');
        sale['user'] = user.id;
        sale['store'] = store;
        return this.http.post(remote.getGlobal('default_url') + 'sale/', sale).pipe(map(
            (response) => {
                return response;
            }
        ));
    }

    deleteSale(sale: any) {
        return this.http.delete(remote.getGlobal('default_url') + 'sale/' + sale.id + '/');
    }

    finishTrade(trade: Trade, payments: SalePayments, updateClient: boolean) {
        trade.store = remote.getGlobal('store');
        return this.http.post(remote.getGlobal('default_url') + 'trade/create/', trade.prepareDataToBackend(payments, updateClient));
    }

    updateSaleFromOrder(sale: any) {
        user = remote.getGlobal('user');
        store = remote.getGlobal('store');
        sale['user'] = user.id;
        sale['store'] = store;
        return this.http.put(remote.getGlobal('default_url') + 'sale/' + sale.id + '/', sale);
    }

    getSales(params: any) {
        store = remote.getGlobal('store');
        if (!params.store) {
            params.store = store;
        } else if (params.store === 'Todas') {
            params['store'] = '';
        }
        return this.http.get<Sale[]>(remote.getGlobal('default_url') + 'sale/', {params: params}).pipe(map(
            (response) => {
                return response.map(p => new Sale(p));
            })
        );
    }

    getTrades(params: any) {
        store = remote.getGlobal('store');
        if (!params.store) {
            params.store = store;
        } else if (params.store === 'Todas') {
            params['store'] = '';
        }
        return this.http.get<Trade[]>(remote.getGlobal('default_url') + 'trade/', {params: params}).pipe(map(
            (response) => {
                return response.map(p => new Trade(p, null));
            })
        );
    }

    getSale(sale: Sale) {
        return this.http.get(remote.getGlobal('default_url') + 'sale/' + sale.id + '/').pipe(map(
            (response: any) => {
                response.products = getProductsFromBackend(response.products);
                response.trade_set = response.trade_set.map(
                    (tradeObject) => {
                        tradeObject['purchasedProducts'] = getProductsFromBackend(tradeObject['purchased_products']);
                        tradeObject['returnedProducts'] = getProductsFromBackend(tradeObject['returned_products']);
                        return new Trade(tradeObject, sale.id);
                    }
                );
                return response;
            })
        );
    }

    getTrade(trade: Trade) {
        return this.http.get(remote.getGlobal('default_url') + 'trade/' + trade.id + '/').pipe(map(
            (response: any) => {
                trade.returnedProducts = getProductsFromBackend(response.returned_products);
                trade.purchasedProducts = getProductsFromBackend(response.purchased_products);
                return trade;
            })
        );
    }

    getWithdrawInformation(params: any) {
        store = remote.getGlobal('store');
        params['store'] = store;
        return this.http.get(remote.getGlobal('default_url') + 'withdraw/0/', {params: params}).pipe(map(
            (response) => {
                return new Withdraw(response);
            }
        ));
    }

    updateWithdraw(params: Withdraw) {
        return this.http.put(remote.getGlobal('default_url') + 'withdraw/' + params.id + '/', params);
    }

    createWithdrawHistory(params: any) {
        user = remote.getGlobal('user');
        store = remote.getGlobal('store');
        params['store'] = store;
        params['user'] = user.id;
        return this.http.post(remote.getGlobal('default_url') + 'withdraw_history/', params);
    }

    getWithdrawHistory(page: number, params: any) {
        store = remote.getGlobal('store');
        params['store'] = store;
        return this.http.get(remote.getGlobal('default_url') + 'withdraw_history/?page=' + page,
            {params: params}).pipe(map(
            (next) => {
                return next['results'];
            }
        ));
    }

    updateStock(params: any) {
        user = remote.getGlobal('user');
        store = remote.getGlobal('store');
        params['from_store'] = store;
        params['user'] = user.id;
        return this.http.patch(remote.getGlobal('default_url') + 'store_product/', params);
    }

    getReportByPayments(params: any) {
        return this.http.get(remote.getGlobal('default_url') + 'payment/report_by_payment/', {params: params});
    }

    getReportByProduct(params: any) {
        return this.http.get(remote.getGlobal('default_url') + 'sale_product/report_by_products/', {params: params});
    }

    addWithdraw(params: any) {
        store = remote.getGlobal('store');
        params['store'] = store;
        return this.http.put(remote.getGlobal('default_url') + 'withdraw/add_withdraw/', {...params});
    }

    updateClient(client: Client) {
        return this.http.put(remote.getGlobal('default_url') + 'client/' + client.id + '/', client);
    }

    updateAllStock(stock) {
        return this.http.patch(remote.getGlobal('default_url') + 'update_storage/', stock);
    }

}
