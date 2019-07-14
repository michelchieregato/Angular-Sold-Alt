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
        this.original_value = purchasedPrice - returnedValue;
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

    public removeAllReturnedProducts(id: number) {
        this.removeProducts('returnedProducts', id);
    }

}
