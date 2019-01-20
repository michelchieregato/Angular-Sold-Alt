import {Stock} from './stock.model';

export class Product {
    id: number;
    name: string;
    size: string;
    price_cost: number;
    price_sell: number;
    stock: Array<Stock>;
    // Only to help on sale screen
    public quantity: number;

    constructor(productInfo: any) {
        this.id = productInfo.id;
        this.name = productInfo.name;
        this.size = productInfo.size;
        this.price_cost = productInfo.price_cost;
        this.price_sell = productInfo.price_sell;
        this.stock = productInfo.stock;
        this.quantity = 1;
    }

    setStock(stock: Array<any>) {
        stock = stock.map((s) => new Stock((s)));
        this.stock = stock;
    }

}
