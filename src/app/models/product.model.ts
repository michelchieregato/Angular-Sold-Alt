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
    public value: number;

    constructor(productInfo: any) {
        this.id = productInfo.id;
        this.name = productInfo.name;
        this.size = productInfo.size;
        this.price_cost = productInfo.price_cost;
        this.price_sell = productInfo.price_sell;
        this.stock = productInfo.stock ? productInfo.stock.map(stock => new Stock(stock)) : undefined;

        // Only when part of sale
        this.quantity = productInfo.quantity || 1;
        this.value = productInfo.value || this.price_sell * this.quantity;
    }

    setStock(stock: Array<any>) {
        stock = stock.map((s) => new Stock((s)));
        this.stock = stock;
    }

    getStock(store: string) {
        return this.stock.filter(stock => stock.store === store)[0].quantity;
    }
}

interface SaleProduct {
    product: any; // May be an id or an object
    quantity: number;
    value: number;
}

export function prepareProductForBackend(product: Product): SaleProduct {
    return {
        product: product.id,
        quantity: product.quantity,
        value: product.price_sell
    };
}

export function getProductsFromBackend(products: Array<SaleProduct>) {
    return products.map(
        (saleProduct) => {
            return new Product({
                ...saleProduct.product,
                ...saleProduct
            });
        }
    );
}
