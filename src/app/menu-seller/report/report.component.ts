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
const store = remote.getGlobal('store');
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
    initialDateProduct;
    finalDateProduct;
    loading = false;

    constructor(private datePipe: DatePipe, private clientServer: ClientService,
                private router: Router) {
        this.initialDateProduct = this.transformDate(new Date());
        this.finalDateProduct = this.transformDate(new Date());
    }

    transformDate(date) {
        return this.datePipe.transform(date, 'yyyy-MM-dd');
    }

    ngOnInit() {
    }

    searchPaymentReport() {
        this.loading = true;

        const auxInitial = this.transformDate(this.initialDatePayment.value);
        let auxFinal = _.cloneDeep(this.finalDatePayment.value);
        auxFinal.setDate(auxFinal.getDate() + 1);
        auxFinal = this.transformDate(auxFinal);

        this.clientServer.getReportByPayments({
            initialDate: auxInitial,
            finalDate: auxFinal,
            store: store
        }).subscribe(
            (success) => {
                this.loading = false;
                const customRoute = this.router.createUrlTree(['payment-report']);
                customRoute.queryParams = {
                    values: JSON.stringify(success),
                    initialDate: auxInitial,
                    finalDate: auxFinal,
                    store: store
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
        this.clientServer.getReportByProduct({
            initial_date: this.initialDatePayment,
            final_date: this.finalDatePayment
        }).subscribe(
            (success) => {
                this.loading = false;
                console.log((success));
                const customRoute = this.router.createUrlTree(['product-report']);
                success['initialDate'] = this.initialDatePayment;
                success['finalDate'] = this.finalDatePayment;
                customRoute.queryParams = {
                    infos: JSON.stringify(success)
                };
                // ipcRenderer.send('pdf', {'url': customRoute.toString().substring(1)});
            },
            (error) => {
                this.loading = false;
                console.log(error);
            }
        );
    }



}
