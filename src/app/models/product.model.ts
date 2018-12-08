export class Product {
    id: number;
    name: string;
    size: string;
    price_cost: number;
    price_sell: number;
    // Only to help on sale screen
    public quantity: number;

    constructor(productInfo: any) {
        this.id = productInfo.id;
        this.name = productInfo.name;
        this.size = productInfo.size;
        this.price_cost = productInfo.price_cost;
        this.price_sell = productInfo.price_sell;
        this.quantity = 1;
    }

}
