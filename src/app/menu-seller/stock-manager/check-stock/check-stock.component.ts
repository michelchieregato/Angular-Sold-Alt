import {Component, OnInit} from '@angular/core';
import {ClientService} from '../../../services/client.service';
import {Product} from '../../../models/product.model';
declare const window: any;
const {remote} = window.require('electron');

@Component({
    selector: 'app-check-stock',
    templateUrl: './check-stock.component.html',
    styleUrls: ['./check-stock.component.scss']
})
export class CheckStockComponent implements OnInit {
    store: string;
    loading = true;
    products: Product[] = [];
    data: StockProduct[] = [];


    constructor(private clientServer: ClientService) {
    }

    ngOnInit() {
        this.store = remote.getGlobal('store');
        this.clientServer.getProducts().subscribe(
            (results) => {
                this.products = results;
                this.data = this.products.map(product => {
                    return {
                        id: product.id,
                        name: product.name,
                        size: product.size,
                        stock: product.getStock(this.store)
                    };
                });
                this.loading = false;
            });
    }

}

interface StockProduct {
    id: number;
    name: string;
    size: string;
    stock: number;
}
