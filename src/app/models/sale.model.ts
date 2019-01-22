import {User} from './user.model';
import {Client} from './client.model';

export class Sale {
    id: number;
    client: Client;
    user: User;
    store: number;
    datetime: number;
    original_value: number;
    value: number;
    finish_later: boolean;
    products: any;
    payments: any;
    discount: number;

    constructor(saleInfo: any) {
        this.id = saleInfo.id;
        this.client = saleInfo.client;
        this.user = saleInfo.user;
        this.store = saleInfo.store;
        this.datetime = saleInfo.datetime;
        this.original_value = saleInfo.original_value;
        this.value = saleInfo.value;
        this.finish_later = saleInfo.finish_later;
        this.products = saleInfo.products || [];
        this.discount = saleInfo.discount;
        this.payments = saleInfo.payments || [];
    }

    public prepareToSendSale(paymentsList, new_: boolean) {
        const saleProducts = [];
        const payments = [];
        if (!new_) {
            this.products.forEach(product => {
                saleProducts.push({
                    product: product.id,
                    quantity: product.quantity,
                    value: product.price_sell
                });
            });
        } else {
            this.products.forEach(product => {
                saleProducts.push({
                    product: product.product.id,
                    quantity: product.quantity,
                    value: product.product.price_sell
                });
            });
        }

        paymentsList.forEach(payment => {
            payments.push({
                paymentMethod: payment.type,
                value: payment.value
            });
        });
        return {
            id: this.id,
            client: this.client.cpf ? this.client.cpf : '000.000.000-00',
            user: this.user.id,
            store: this.store,
            original_value: this.original_value,
            discount: this.discount,
            value: this.value ? this.value : this.original_value,
            finish_later: this.finish_later,
            products: saleProducts,
            payments: payments
        };
    }

}
