import {User} from './user.model';
import {Client} from './client.model';
import {Product} from './product.model';
import {roundTo} from './payment.model';
import {TypeOfSale} from '../constants/enums';

export class Sale {
    id: number;
    client: Client;
    user: User;
    store: number;
    datetime: Date;
    original_value: number;
    value: number;
    finish_later: boolean;
    products: Array<Product>;
    payments: any;
    discount: number;
    TYPE = TypeOfSale.SALE;

    constructor(saleInfo: any) {
        this.id = saleInfo.id;
        this.client = saleInfo.client;
        this.user = saleInfo.user;
        this.store = saleInfo.store;
        this.datetime = saleInfo.datetime ? new Date(saleInfo.datetime) : undefined;
        this.original_value = parseFloat(saleInfo.original_value);
        this.value = parseFloat(saleInfo.value);
        this.finish_later = saleInfo.finish_later;
        this.products = saleInfo.products || [];
        this.discount = saleInfo.discount;
        this.payments = saleInfo.payments || [];
    }

    public getProductOnSaleList(id) {
        return this.products.filter(saleProduct => {
            return saleProduct.id === id;
        })[0];
    }

    private getSaleValue() {
        if (this.products.length) {
            this.original_value = Math.round(this.products.map(saleProduct => {
                return (saleProduct.quantity * saleProduct.price_sell);
            }).reduce((a, b) => {
                return a + b;
            }) * 100) / 100;
        } else {
            this.original_value = 0;
        }
    }

    public addProduct(product: Product, qnt: number) {
        let productToAdd = new Product(product);
        const getProduct = this.getProductOnSaleList(product.id);
        if (getProduct) {
            getProduct.quantity += qnt;
            this.products = [...this.products];
        } else {
            product.quantity = qnt;
            this.products = [...this.products, productToAdd];
        }
        this.getSaleValue();
    }

    public removeProduct(id: number, qnt: number) {
        const getProduct = this.getProductOnSaleList(id);
        console.log(getProduct)
        if (getProduct && getProduct.quantity > qnt) {
            getProduct.quantity -= qnt;
            this.getSaleValue();
        } else if (getProduct) {
            this.removeProducts(id);
        }
    }

    public removeProducts(id: number) {
        this.products = this.products.filter(saleProduct => {
            return saleProduct.id !== id;
        });
        this.getSaleValue();
    }

    public calculateValue() {
        this.value = roundTo(this.original_value * (1 - this.discount / 100), 2);
        var a = 1;
        console.log(a);

    }

    public prepareToSendSale(paymentsList) {
        const saleProducts = [];
        const payments = [];

        this.products.forEach(product => {
            saleProducts.push({
                product: product.id,
                quantity: product.quantity,
                value: product.price_sell
            });
        });

        paymentsList.forEach(payment => {
            payments.push({
                paymentMethod: payment.type,
                value: payment.value
            });
        });

        return {
            id: this.id,
            client: this.client.id === 0 ? 1 : this.client.id,
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
