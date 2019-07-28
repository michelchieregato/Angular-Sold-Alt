import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ClientService} from '../../../services/client.service';
import {Sale} from '../../../models/sale.model';
import {Router} from '@angular/router';
import {Trade} from '../../../models/trade.model';

declare const window: any;
const {ipcRenderer, remote} = window.require('electron');
import * as _ from 'lodash';

export interface SaleDetailData {
    sale: Sale;
}

@Component({
    selector: 'app-sale-detail',
    templateUrl: './sale-detail.component.html',
    styleUrls: ['./sale-detail.component.scss']
})
export class SaleDetailComponent implements OnInit {
    sale: Sale;
    updatedSale: Sale;
    label: string;
    payments = [];
    totalReceived = 0;
    loading = true;
    trades: Trade[] = [];

    constructor(public dialogRef: MatDialogRef<SaleDetailComponent>,
                @Inject(MAT_DIALOG_DATA) public data: SaleDetailData,
                private clientService: ClientService, private router: Router) {
    }

    ngOnInit() {
        this.sale = this.data.sale;
        this.label = this.sale.finish_later ?  'Encomenda' : 'Venda Original';

        this.clientService.getSale(this.data.sale).subscribe(
            (response) => {
                this.sale.products = response.products;
                this.trades = response.trade_set;
                this.getUpdatedSale();
                this.loading = false;
            },
            () => {
                this.loading = false;
            }
        );

        this.payments = this.data.sale.payments;
        if (this.payments.length) {
            this.totalReceived = this.payments.map(p => parseFloat(p.value)).reduce((a, b) => a + b);
        }
    }

    private getUpdatedSale() {
        if (this.trades.length) {
            this.updatedSale = _.cloneDeep(this.sale);
            let returnedProducts = [], purchasedProducts = [];
            this.trades.forEach(
                (trade) => {
                    returnedProducts = [...returnedProducts, ...trade.returnedProducts];
                    purchasedProducts = [...purchasedProducts, ...trade.purchasedProducts];
                }
            );

            purchasedProducts.forEach(
                (purchasedProduct) => {
                    this.updatedSale.addProduct(purchasedProduct, purchasedProduct.quantity);
                }
            );

            returnedProducts.forEach(
                (returnedProduct) => {
                    this.updatedSale.removeProduct(returnedProduct.id, returnedProduct.quantity);
                }
            );

            this.updatedSale.calculateValue();
        }
    }

    private getUrlToGo(componentPath: string) {
        const urlTree = this.router.createUrlTree(['sale', componentPath]);
        urlTree.queryParams = {
            sale: JSON.stringify(this.updatedSale)
        };
        return urlTree.toString().substring(1);
    }

    finishOrder() {
        ipcRenderer.send('open-order-screen', {'url': this.getUrlToGo('order')});

        this.dialogRef.close();
    }

    tradeProducts() {
        ipcRenderer.send('open-order-screen', {'url': this.getUrlToGo('trade')});
        this.dialogRef.close();
    }

    generateTaxCupom() {
        const a = this.router.createUrlTree(['tax-cupom']);
        this.data.sale.products = this.sale.products;
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
