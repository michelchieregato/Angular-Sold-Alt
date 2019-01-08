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
        this.sale = new Sale(JSON.parse(this.router.snapshot.queryParams.sale));
        this.client = new Client(this.sale.client);
        this.payments = JSON.parse(this.router.snapshot.queryParams.payments);
        this.date = (this.sale.datetime ? new Date(this.sale.datetime) : this.date);
        this.change = this.router.snapshot.queryParams.payments;
        console.log(typeof(this.change))
    }

}
