import {User} from './user.model';
import {Client} from './client.model';

export class Sale {
    client: Client;
    user: User;
    store: number;
    datetime: number;
    value: number;
    finish_later: boolean;
    products: any;
    discount: number;

    constructor(saleInfo: any) {
        this.client = saleInfo.client;
        this.user = saleInfo.user;
        this.store = saleInfo.store;
        this.datetime = saleInfo.datetime;
        this.value = saleInfo.value;
        this.finish_later = saleInfo.finish_later;
        this.products = saleInfo.products;
        this.discount = saleInfo.discount;
    }

    public prepareToSendSale(paymentsList) {
        const products = {};
        const payments = {};
        this.products.forEach(product => {
            products[product.id] = product.quantity;
        });
        paymentsList.forEach(payment => {
            payments[payment.type] = payment.value;
        });
        return {
            client: this.client.id,
            user: this.user.id,
            store: this.store,
            value: this.value,
            finish_later: this.finish_later,
            products: products,
            payments: payments
        };
    }

}
