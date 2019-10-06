import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Client} from '../models/client.model';
import {Sale} from '../models/sale.model';
import {TypeOfSale} from '../constants/enums';
import {Trade} from '../models/trade.model';
import {Product} from '../models/product.model';
import {User} from '../models/user.model';
import {roundTo} from '../models/payment.model';

@Component({
    selector: 'app-tax-cupom',
    templateUrl: './tax-cupom.component.html',
    styleUrls: ['./tax-cupom.component.scss']
})
export class TaxCupomComponent implements OnInit {

    client = new Client({});
    sale = new Sale({});
    trade = new Trade({}, null);
    date = new Date();
    payments = [];
    change = 0;
    user: User;
    store: any;
    discount: number;
    value: number;
    total_value: number = 0;
    returnedValue: number = 0;
    clientDiscount = 0;
    products: Product[] = [];
    type: TypeOfSale;

    constructor(private router: ActivatedRoute) {
    }

    ngOnInit() {

        console.log(this.router.snapshot.queryParams.type);

        // tslint:disable-next-line:triple-equals
        if (this.router.snapshot.queryParams.type == TypeOfSale.SALE) {
            this.type = TypeOfSale.SALE;
            console.log(this.router.snapshot.queryParams.sale);
            this.sale = new Sale(JSON.parse(this.router.snapshot.queryParams.sale));
            this.products = this.sale.products;
            this.store = this.sale.store;
            this.value = this.sale.value;
            this.user = this.sale.user;
            this.client = new Client(this.sale.client);
            this.date = (this.sale.datetime ? new Date(this.sale.datetime) : this.date);
            this.total_value = this.sale.original_value;
            this.discount = this.sale.discount;
            this.clientDiscount = this.sale.clientDiscount;
        } else {
            this.type = TypeOfSale.TRADE;
            this.trade = new Trade(JSON.parse(this.router.snapshot.queryParams.trade),
                JSON.parse(this.router.snapshot.queryParams.trade)['sale']);
            this.products = this.trade.purchasedProducts;
            this.store = this.trade.store;
            this.value = this.trade.value;
            this.user = this.trade.user;
            this.client = new Client(this.trade.client);
            this.date = (this.trade.datetime ? new Date(this.trade.datetime) : this.date);
            this.discount = this.trade.discount;
            this.clientDiscount = this.trade.clientDiscount;
            this.returnedValue = roundTo(this.trade.returnedProducts.map((product) => {
                return product.quantity * product.price_sell;
            }).reduce((a, b) => {
                return a + b;
            }), 2);
            if (this.trade.purchasedProducts) {
                this.total_value = roundTo(this.trade.purchasedProducts.map((product) => {
                    return product.quantity * product.price_sell;
                }).reduce((a, b) => {
                    return a + b;
                }), 2);
            }
        }

        this.payments = JSON.parse(this.router.snapshot.queryParams.payments);
        this.change = parseFloat(this.router.snapshot.queryParams.change);
    }

}
