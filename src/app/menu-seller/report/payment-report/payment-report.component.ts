import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';

@Component({
    selector: 'app-payment-report',
    templateUrl: './payment-report.component.html',
    styleUrls: ['./payment-report.component.scss']
})
export class PaymentReportComponent implements OnInit {
    initialDate: string;
    finalDate: string;
    store: string;
    values =  {};
    total = 0;

    constructor(private router: ActivatedRoute) {
    }

    ngOnInit() {
        this.initialDate = this.router.snapshot.queryParams.initialDate;
        this.finalDate = this.router.snapshot.queryParams.finalDate;
        this.store = this.router.snapshot.queryParams.store;
        const values = JSON.parse(this.router.snapshot.queryParams.values);
        for (const [key, value] of Object.entries(values)) {
            this.values[key] = value['value__sum'] || 0;
            this.total += this.values[key];
        }
    }

}
