export class Stock {
    store: string;
    quantity: number;

    constructor(stockInfo: any) {
        this.store = stockInfo.store;
        this.quantity = stockInfo.quantity;
    }

}
