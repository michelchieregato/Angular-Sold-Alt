import {Component, ElementRef, OnInit} from '@angular/core';
import {ClientServer} from '../../services/client.server';
import {Product} from '../../models/product.model';
import {Sale} from '../../models/sale.model';

@Component({
    selector: 'app-sale',
    templateUrl: './sale.component.html',
    styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {
    products = [];
    displayProducts = [];
    saleProducts = [];
    product = new Product({});
    qnt = 1;
    total = 0;

    constructor(private clientServer: ClientServer, private elRef: ElementRef) {
        elRef.nativeElement.ownerDocument.body.style.overflow = 'hidden';
    }

    ngOnInit() {
        this.clientServer.getProducts().subscribe(
            (response) => {
                this.products = response;
                this.displayProducts = this.products;
                this.product = this.products[0];
            }
        );
    }

    updatePanel(product) {
        this.product = product;
    }

    searchProduct(searchValue: string) {
        this.displayProducts = this.products.filter(product => {
            return product.name.toLowerCase().includes(searchValue.toLowerCase());
        });
    }

    private getProductOnSaleList(id) {
        return this.saleProducts.filter(saleProduct => {
            return saleProduct.id === id;
        });
    }

    private getSaleValue() {
        this.total =  this.saleProducts.map(saleProduct => {
            return (saleProduct.quantity * saleProduct.price_sell);
        }).reduce((a, b) => {
            return a + b;
        });
    }

    addProduct() {
        if (this.getProductOnSaleList(this.product.id).length) {
            this.getProductOnSaleList(this.product.id)[0].quantity += this.qnt;
        } else {
            this.product.quantity = this.qnt;
            this.saleProducts.push(this.product);
        }
        this.getSaleValue();
        this.qnt = 1;
    }

    removeProduct(id: number) {
        this.saleProducts = this.saleProducts.filter(saleProduct => {
            return saleProduct.id !== id;
        });
        this.getSaleValue();
    }

    endSale() {
        let sale = new Sale({
            client: 1,
            user: 2,
            store: 1,

        });
    }

}
