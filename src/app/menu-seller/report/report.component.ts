import {Component, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ClientService} from '../../services/client.service';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material';
import {APP_DATE_FORMATS, AppDateAdapter} from '../search-sale/search-sale.component';
import * as _ from 'lodash';

declare const window: any;
const {remote} = window.require('electron');
const {ipcRenderer} = window.require('electron');

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class ReportComponent implements OnInit {
    initialDatePayment = new FormControl(new Date());
    finalDatePayment = new FormControl(new Date());
    initialDateProduct = new FormControl(new Date());
    finalDateProduct = new FormControl(new Date());
    loading = false;
    store;

    constructor(private datePipe: DatePipe, private clientServer: ClientService,
                private router: Router) {
    }

    transformDate(date) {
        return this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ssZ');
    }

    ngOnInit() {
        this.store = remote.getGlobal('store');
    }

    prepareData(dateType: string) {
        this.loading = true;
        let auxInitial = _.cloneDeep(this['initialDate' + dateType].value);
        auxInitial.setHours(0, 0, 0);
        auxInitial = this.transformDate(auxInitial);
        let auxFinal = _.cloneDeep(this['finalDate' + dateType].value);
        auxFinal.setHours(23, 59, 59);
        auxFinal = this.transformDate(auxFinal);

        return [auxInitial, auxFinal];
    }

    searchPaymentReport() {
        const [auxInitial, auxFinal] = this.prepareData('Payment');

        this.clientServer.getReportByPayments({
            initialDate: auxInitial,
            finalDate: auxFinal,
            store: this.store
        }).subscribe(
            (success) => {
                this.loading = false;
                const customRoute = this.router.createUrlTree(['payment-report']);
                customRoute.queryParams = {
                    values: JSON.stringify(success),
                    initialDate: auxInitial,
                    finalDate: auxFinal,
                    store: this.store
                };
                ipcRenderer.send('pdf', {'url': customRoute.toString().substring(1)});
            },
            (error) => {
                this.loading = false;
                console.log(error);
            }
        );
    }

    searchProductReport() {
        this.loading = true;
        const [auxInitial, auxFinal] = this.prepareData('Product');
        this.clientServer.getReportByProduct({
            initialDate: auxInitial,
            finalDate: auxFinal,
            store: this.store
        }).subscribe(
            (success: {returned_products, purchased_products}) => {
                this.loading = false;
                console.log(success);
                const customRoute = this.router.createUrlTree(['product-report']);
                customRoute.queryParams = {
                    purchasedProducts: JSON.stringify(success.purchased_products),
                    returnedProducts: JSON.stringify(success.returned_products),
                    initialDate: auxInitial,
                    finalDate: auxFinal,
                    store: this.store
                };
                ipcRenderer.send('pdf', {'url': customRoute.toString().substring(1)});
            },
            (error) => {
                this.loading = false;
                console.log(error);
            }
        );
    }



}
