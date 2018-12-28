import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ClientService} from '../../../services/client.service';

const async = require('async');

export interface SaleDetailData {
    id: number;
}

@Component({
    selector: 'app-sale-detail',
    templateUrl: './sale-detail.component.html',
    styleUrls: ['./sale-detail.component.scss']
})
export class SaleDetailComponent implements OnInit {
    saleProducts = [];
    payments = [];
    loading = true;

    constructor(public dialogRef: MatDialogRef<SaleDetailComponent>,
                @Inject(MAT_DIALOG_DATA) public data: SaleDetailData,
                private clientService: ClientService) {
    }

    ngOnInit() {
        async.parallel({
                saleProducts: (callback) => {
                    this.clientService.getSaleProducts(this.data.sale.id).subscribe(
                        (next) => {
                            callback(null, next);
                        }
                    );
                },
                payments: (callback) => {
                    this.clientService.getSalePayments(this.data.sale.id).subscribe(
                        (next) => {
                            callback(null, next);
                        });
                }
            },
            (err, results) => {
                this.saleProducts = results.saleProducts;
                this.payments = results.payments;
                this.loading = false;
            });
    }

}
