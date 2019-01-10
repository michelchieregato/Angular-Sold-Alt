import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Sale} from '../../../models/sale.model';

@Component({
    selector: 'app-payment-report',
    templateUrl: './payment-report.component.html',
    styleUrls: ['./payment-report.component.scss']
})
export class PaymentReportComponent implements OnInit {
    infos: any;
    moneyPerType: any;

    constructor(private router: ActivatedRoute) {
    }

    ngOnInit() {
        this.infos = JSON.parse(this.router.snapshot.queryParams.infos);
        console.log(this.router.snapshot.queryParams)
        this.moneyPerType = {};
        for (let i = 0; i < this.infos.lojas.length; i++) {
            this.moneyPerType[this.infos.lojas[i]] = this.infos.forma_de_pagamento[i];
        }
    }

}
