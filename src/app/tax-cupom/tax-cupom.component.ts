import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Client} from '../models/client.model';
import {Sale} from '../models/sale.model';

@Component({
    selector: 'app-tax-cupom',
    templateUrl: './tax-cupom.component.html',
    styleUrls: ['./tax-cupom.component.scss']
})
export class TaxCupomComponent implements OnInit {

    client = new Client({});
    sale = new Sale({});
    date = new Date();
    payments = {};
    change = 0;

    constructor(private router: ActivatedRoute) {
    }

    ngOnInit() {
        console.log('aquiii')
        this.sale = new Sale(JSON.parse(this.router.snapshot.queryParams.sale));

        console.log(this.sale);
        // TODO arrumar migues
        if (this.sale.products[0].product) {
            console.log('aquiii')
            this.sale.products = this.sale.products.map(p => {
                console.log(p)
                return {
                    quantity: p['quantity'],
                    ...p.product
                };
            });
        }
        console.log(this.sale);
        this.client = new Client(this.sale.client);
        this.payments = JSON.parse(this.router.snapshot.queryParams.payments);
        this.date = (this.sale.datetime ? new Date(this.sale.datetime) : this.date);
        this.change = parseFloat(this.router.snapshot.queryParams.change);
        // this.sale.value = parseFloat(this.sale.value);
    }

}
