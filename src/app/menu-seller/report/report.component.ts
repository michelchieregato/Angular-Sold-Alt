import {Component, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ClientService} from '../../services/client.service';
import {Router} from '@angular/router';

declare const window: any;
const {ipcRenderer} = window.require('electron');

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
    initialDatePayment;
    finalDatePayment;
    initialDateProduct;
    finalDateProduct;
    loading = false;

    constructor(private datePipe: DatePipe, private clientServer: ClientService,
                private router: Router) {
        this.initialDatePayment = this.transformDate(new Date());
        this.finalDatePayment = this.transformDate(new Date());
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
        this.clientServer.getReportByPayments({
            initial_date: this.initialDatePayment,
            final_date: this.finalDatePayment
        }).subscribe(
            (success) => {
                this.loading = false;
                const customRoute = this.router.createUrlTree(['payment-report']);
                success['initial_date'] = this.initialDatePayment;
                success['final_date'] = this.finalDatePayment;
                customRoute.queryParams = {
                    infos: JSON.stringify(success)
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
        this.clientServer.getReportByPayments({
            initial_date: this.initialDatePayment,
            final_date: this.finalDatePayment
        }).subscribe(
            (success) => {
                this.loading = false;
                const customRoute = this.router.createUrlTree(['product-report']);
                success['initial_date'] = this.initialDatePayment;
                success['final_date'] = this.finalDatePayment;
                customRoute.queryParams = {
                    infos: JSON.stringify(success)
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
