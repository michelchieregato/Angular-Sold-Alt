import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ClientService} from '../../../services/client.service';
import {Sale} from '../../../models/sale.model';
import {Router} from '@angular/router';

declare const window: any;
const {ipcRenderer} = window.require('electron');

export interface SaleDetailData {
    sale: Sale;
}

@Component({
    selector: 'app-sale-detail',
    templateUrl: './sale-detail.component.html',
    styleUrls: ['./sale-detail.component.scss']
})
export class SaleDetailComponent implements OnInit {
    saleProducts = [];
    payments = [];
    totalReceived = 0;
    loading = true;

    constructor(public dialogRef: MatDialogRef<SaleDetailComponent>,
                @Inject(MAT_DIALOG_DATA) public data: SaleDetailData,
                private clientService: ClientService, private router: Router) {
    }

    ngOnInit() {
        console.log(this.data.sale);
        this.clientService.getSale(this.data.sale.id).subscribe(
            (results) => {
                this.saleProducts = results['products'];
                this.loading = false;
            },
            (err) => {
                console.log(err);
                this.loading = false;
            }
        );

        this.payments = this.data.sale.payments;
        if (this.payments.length) {
            this.totalReceived = this.payments.map(p => parseFloat(p.value)).reduce((a, b) => a + b);
        }
    }

    finishOrder() {
        this.data.sale.products = this.saleProducts;
        const a = this.router.createUrlTree(['sale', 'order']);
        a.queryParams = {
            sale: JSON.stringify(this.data.sale)
        };
        console.log(a.toString().substring(1))
        ipcRenderer.send('open-order-screen', {'url': a.toString().substring(1)});
    }

}
