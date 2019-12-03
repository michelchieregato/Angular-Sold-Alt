import {Product} from './product.model';
import {TypeOfSale} from '../constants/enums';
import {Trade} from './trade.model';
import {Transaction} from './transaction.model';

export class Sale extends Transaction {
    products: Array<Product>;
    finish_later: boolean;
    trades: Trade[] = [];
    TYPE = TypeOfSale.SALE;

    constructor(saleInfo: any) {
        super(saleInfo);

        this.finish_later = saleInfo.finish_later;
        this.products = saleInfo.products || [];

        if (saleInfo.finish_later) {
            this.TYPE = TypeOfSale.ORDER;
        }
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
            console.log(qnt);
            productToAdd.quantity = qnt;
            this.products = [...this.products, productToAdd];
        }
        this.getSaleValue();
    }

    public removeProduct(id: number, qnt: number) {
        const getProduct = this.getProductOnSaleList(id);
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
            value: this.value,
            finish_later: this.finish_later,
            products: saleProducts,
            payments: payments,
            client_discount: this.clientDiscount
        };
    }

}
