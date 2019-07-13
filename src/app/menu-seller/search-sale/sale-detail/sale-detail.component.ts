import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ClientService} from '../../../services/client.service';
import {Sale} from '../../../models/sale.model';
import {Router} from '@angular/router';

declare const window: any;
const {ipcRenderer, remote} = window.require('electron');

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
        if (this.data.sale.products.length) {
            this.saleProducts = this.data.sale.products;
            this.loading = false;
        }
        this.clientService.getSale(this.data.sale.id).subscribe(
            (products) => {
                this.saleProducts = products;
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

    private getUrlToGo(componentPath: string) {
        this.data.sale.products = this.saleProducts;
        const urlTree = this.router.createUrlTree(['sale', componentPath]);
        urlTree.queryParams = {
            sale: JSON.stringify(this.data.sale)
        };
        return urlTree.toString().substring(1);
    }

    finishOrder() {
        ipcRenderer.send('open-order-screen', {'url': this.getUrlToGo('order')});
    }

    tradeProducts() {
        ipcRenderer.send('open-order-screen', {'url': this.getUrlToGo('trade')});
    }

    generateTaxCupom() {
        const a = this.router.createUrlTree(['tax-cupom']);
        this.data.sale.products = this.saleProducts;
        this.data.sale.user = remote.getGlobal('user');
        this.data.sale.store = remote.getGlobal('store');
        const change = this.totalReceived - this.data.sale.value;
        a.queryParams = {
            sale: JSON.stringify(this.data.sale),
            payments: JSON.stringify(this.payments),
            change: Math.round(change * 100) / 100
        };
        ipcRenderer.send('pdf', {'url': a.toString().substring(1)});
    }

}
