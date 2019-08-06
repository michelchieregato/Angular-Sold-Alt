import {Sale} from './sale.model';
import {prepareProductForBackend, Product} from './product.model';
import {preparePaymentForBackend, roundTo, SalePayments} from './payment.model';
import {Client} from './client.model';
import {TypeOfSale} from '../constants/enums';

export class Trade {
    id: number;
    sale: Sale;
    datetime: Date;
    value: number = 0;
    original_value: number = 0;
    discount: number = 0;
    returnedProducts: Product[] = [];
    purchasedProducts: Product[] = [];

    // For search sale screen
    store: any;
    client: Client;
    payments: any;
    TYPE = TypeOfSale.TRADE;

    constructor(tradeInfo: any, sale: Sale) {
        this.id = tradeInfo.id;
        this.sale = sale;
        this.datetime = tradeInfo.datetime ? new Date(tradeInfo.datetime) : undefined;
        this.returnedProducts = tradeInfo.returnedProducts || [];
        this.purchasedProducts = tradeInfo.purchasedProducts || [];
        this.value = tradeInfo.value ? parseFloat(tradeInfo.value) : 0;
        this.original_value = tradeInfo.original_value ? parseFloat(tradeInfo.original_value) : 0;
        this.discount = tradeInfo.discount ? parseFloat(tradeInfo.discount) : 0;

        // For search sale screen
        this.client = tradeInfo.client;
        this.store = tradeInfo.store;
        this.payments = tradeInfo.payments;
    }

    private getTradeValue() {
        let purchasedPrice = 0, returnedValue = 0;
        if (this.purchasedProducts.length) {
            purchasedPrice = Math.round(this.purchasedProducts.map(saleProduct => {
                return (saleProduct.quantity * saleProduct.price_sell);
            }).reduce((a, b) => {
                return a + b;
            }) * 100) / 100;
        }
        if (this.returnedProducts.length) {
            returnedValue = Math.round(this.returnedProducts.map(saleProduct => {
                return (saleProduct.quantity * saleProduct.price_sell);
            }).reduce((a, b) => {
                return a + b;
            }) * 100) / 100;
        }
        this.original_value = roundTo(purchasedPrice - returnedValue, 2);
        this.value = roundTo(this.original_value * (1 - this.discount / 100), 2);
        this.value = this.value >= 0 ? this.value : 0;
    }

    public getProductOnList(productList, id) {
        return this[productList].filter(saleProduct => {
            return saleProduct.id === id;
        })[0];
    }

    private addProduct(productList: string, product: Product, qnt: number) {
        const getProduct = this.getProductOnList(productList, product.id);
        if (getProduct) {
            getProduct.quantity += qnt;
            this[productList] = [...this[productList]];
        } else {
            product.quantity = qnt;
            this[productList] = [...this[productList], product];
        }
        this.getTradeValue();
    }

    private removeProducts(productList: string, id: number) {
        this[productList] = this[productList].filter(saleProduct => {
            return saleProduct.id !== id;
        });
        this.getTradeValue();
    }

    private removeProduct(productList: string, id: number, qnt: number) {
        const getProduct = this.getProductOnList(productList, id);
        if (getProduct && getProduct.quantity > qnt) {
            getProduct.quantity -= qnt;
            this.getTradeValue();
        } else if (getProduct) {
            this.removeProducts(productList, id);
        }
    }

    public addPurchasedProduct(product: Product) {
        let productToAdd = new Product(product);
        this.addProduct('purchasedProducts', productToAdd, 1);
    }

    // noinspection JSUnusedGlobalSymbols
    public removePurchasedProduct(id: number) {
        this.removeProduct('purchasedProducts', id, 1);
    }

    public removeAllPurchasedProducts(id: number) {
        this.removeProducts('purchasedProducts', id);
    }

    public addReturnedProduct(product: Product) {
        let productToAdd = new Product(product);
        this.addProduct('returnedProducts', productToAdd, 1);
    }

    public removeReturnedProduct(id: number) {
        this.removeProduct('returnedProducts', id, 1);
    }

    // noinspection JSUnusedGlobalSymbols
    public removeAllReturnedProducts(id: number) {
        this.removeProducts('returnedProducts', id);
    }

    public prepareDataToBackend(payments: SalePayments, updateClient: boolean) {
        let returnedProducts = this.returnedProducts.map(prepareProductForBackend);
        let purchasedProducts = this.purchasedProducts.map(prepareProductForBackend);
        let paymentsArray = new SalePayments(payments).payments.map(preparePaymentForBackend);
        this.value = this.value >= 0 ? this.value : 0;

        return {
            ...this,
            returned_products: returnedProducts,
            purchased_products: purchasedProducts,
            payments: paymentsArray,
            sale: this.sale.id,
            client: this.sale.client.id === 0 ? 1 : this.sale.client.id,
            updateClient: updateClient
        };
    }

}

