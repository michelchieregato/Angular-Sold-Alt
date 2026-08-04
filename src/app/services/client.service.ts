import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getProductsFromBackend, Product} from '../models/product.model';
import {Client} from '../models/client.model';
import {Sale} from '../models/sale.model';
import {Withdraw} from '../models/withdraw.model';
import {map} from 'rxjs/operators';
import {Trade} from '../models/trade.model';
import {SalePayments} from '../models/payment.model';
import {environment} from '../../environments/environment';
import {SessionService} from './session.service';

const apiUrl = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class ClientService {
    constructor(private http: HttpClient, private session: SessionService) {
    }

    login(auth: {}) {
        return this.http.post(apiUrl + 'login/', auth);
    }

    getProducts(full: any = false, old: any = true) {
        let school = this.session.getSchool();
        return this.http.get<Product[]>(apiUrl + 'product/', {params: {school, full, old} as any}).pipe(map(
            (response) => {
                return response.map(p => new Product(p));
            }
        ));
    }

    getStockProduct(id: number) {
        return this.http.get(apiUrl + 'product/' + id + '/');
    }

    getClients(query: string) {
        let school = this.session.getSchool();
        return this.http.get<Client[]>(apiUrl + 'client/', {params: {'search': query, school} as any}).pipe(map(
            (response) => {
                return response.map(p => new Client(p));
            })
        );
    }

    saveClient(client: Client) {
        return this.http.post(apiUrl + 'client/', client);
    }

    finishSale(sale: any) {
        sale['user'] = this.session.getUser().id;
        sale['store'] = this.session.getStore();
        return this.http.post(apiUrl + 'sale/', sale).pipe(map(
            (response) => {
                return response;
            }
        ));
    }

    deleteSale(sale: any) {
        return this.http.delete(apiUrl + 'sale/' + sale.id + '/');
    }

    finishTrade(trade: Trade, payments: SalePayments, updateClient: boolean) {
        trade.store = this.session.getStore();
        return this.http.post(apiUrl + 'trade/create/', trade.prepareDataToBackend(payments, updateClient));
    }

    updateSaleFromOrder(sale: any) {
        sale['user'] = this.session.getUser().id;
        sale['store'] = this.session.getStore();
        return this.http.put(apiUrl + 'sale/' + sale.id + '/', sale);
    }

    getSales(params: any) {
        if (!params.store) {
            params.store = this.session.getStore();
        } else if (params.store === 'Todas') {
            params['store'] = '';
            params['school'] = this.session.getSchool();
        }
        return this.http.get<Sale[]>(apiUrl + 'sale/', {params: params}).pipe(map(
            (response) => {
                return response.map(p => new Sale(p));
            })
        );
    }

    getTrades(params: any) {
        if (!params.store) {
            params.store = this.session.getStore();
        } else if (params.store === 'Todas') {
            params['store'] = '';
        }
        return this.http.get<Trade[]>(apiUrl + 'trade/', {params: params}).pipe(map(
            (response) => {
                return response.map(p => new Trade(p, null));
            })
        );
    }

    getSale(sale: Sale) {
        return this.http.get(apiUrl + 'sale/' + sale.id + '/').pipe(map(
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
        return this.http.get(apiUrl + 'trade/' + trade.id + '/').pipe(map(
            (response: any) => {
                trade.returnedProducts = getProductsFromBackend(response.returned_products);
                trade.purchasedProducts = getProductsFromBackend(response.purchased_products);
                return trade;
            })
        );
    }

    getWithdrawInformation(params: any) {
        params['store'] = this.session.getStore();
        return this.http.get(apiUrl + 'withdraw/0/', {params: params}).pipe(map(
            (response) => {
                return new Withdraw(response);
            }
        ));
    }

    updateWithdraw(params: Withdraw) {
        return this.http.put(apiUrl + 'withdraw/' + params.id + '/', params);
    }

    createWithdrawHistory(params: any) {
        params['store'] = this.session.getStore();
        params['user'] = this.session.getUser().id;
        return this.http.post(apiUrl + 'withdraw_history/', params);
    }

    getWithdrawHistory(page: number, params: any) {
        params['store'] = this.session.getStore();
        return this.http.get(apiUrl + 'withdraw_history/?page=' + page,
            {params: params}).pipe(map(
            (next) => {
                return next['results'];
            }
        ));
    }

    updateStock(params: any) {
        params['from_store'] = this.session.getStore();
        params['user'] = this.session.getUser().id;
        return this.http.patch(apiUrl + 'store_product/', params);
    }

    getReportByPayments(params: any) {
        return this.http.get(apiUrl + 'payment/report_by_payment/', {params: params});
    }

    getReportByProduct(params: any) {
        return this.http.get(apiUrl + 'sale_product/report_by_products/', {params: params});
    }

    addWithdraw(params: any) {
        params['store'] = this.session.getStore();
        return this.http.put(apiUrl + 'withdraw/add_withdraw/', {...params});
    }

    updateClient(client: Client) {
        return this.http.put(apiUrl + 'client/' + client.id + '/', client);
    }

    updateAllStock(stock) {
        return this.http.patch(apiUrl + 'update_storage/', stock);
    }

}
