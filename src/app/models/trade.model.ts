import {Sale} from './sale.model';
import {Product} from './product.model';

export class Trade {
    id: number;
    sale: Sale;
    datetime: number;
    value: number;
    original_value: number;
    returnedProducts: Product[] = [];
    purchasedProducts: Product[] = [];

    constructor(tradeInfo: object, sale: Sale) {
        this.id = tradeInfo.id;
        this.sale = sale;
        this.datetime = tradeInfo.datetime;
        this.returnedProducts = tradeInfo.returnedProducts || [];
        this.purchasedProducts = tradeInfo.purchasedProducts || [];
        this.value = tradeInfo.value;
        this.original_value = tradeInfo.original_value;
    }

    private getTradeValue() {
        let purchasedPrice = 0, returnedValue = 0;
        if (this.purchasedProducts.length) {
            purchasedPrice = Math.round(this.products.map(saleProduct => {
                return (saleProduct.quantity * saleProduct.price_sell);
            }).reduce((a, b) => {
                return a + b;
            }) * 100) / 100;
        }
        if (this.returnedProducts.length) {
            returnedValue = Math.round(this.products.map(saleProduct => {
                return (saleProduct.quantity * saleProduct.price_sell);
            }).reduce((a, b) => {
                return a + b;
            }) * 100) / 100;
        }
        this.original_value = purchasedPrice - returnedValue;
    }

    private getProductOnList(productList, id) {
        return this[productList].filter(saleProduct => {
            return saleProduct.id === id;
        });
    }

    private addProduct(productList: string, product: Product, qnt: number) {
        const getProduct = this.getProductOnList(productList, product.id);
        if (getProduct.length) {
            getProduct[0].quantity += qnt;
            this[productList] = [...this[productList]];
        } else {
            product.quantity = qnt;
            this[productList] = [...this[productList], product];
        }
        this.getTradeValue();
    }

    private removeProduct(productList: string, id: number) {
        this[productList] = this[productList].filter(saleProduct => {
            return saleProduct.id !== id;
        });
        this.getTradeValue();
    }

    public addPurchasedProduct(product: Product) {
        this.addProduct('purchasedProducts', product, 1);
    }

    public removePurchasedProduct(id: number) {
        this.removeProduct('purchasedProducts', id);
    }

    public addReturnedProduct(product: Product) {
        this.addProduct('returnedProducts', product, 1);
    }

    public removeReturnedProduct(id: number) {
        this.removeProduct('returnedProducts', id);
    }

}
