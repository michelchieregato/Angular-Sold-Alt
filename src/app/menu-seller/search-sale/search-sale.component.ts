import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ClientService} from '../../services/client.service';
import {Sale} from '../../models/sale.model';
import {formatDate} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {SaleDetailComponent} from './sale-detail/sale-detail.component';
import {Client} from '../../models/client.model';

const async = require('async');

@Component({
    selector: 'app-search-sale',
    templateUrl: './search-sale.component.html',
    styleUrls: ['./search-sale.component.scss']
})
export class SearchSaleComponent implements OnInit {
    sales: SaleOrTradeList[] = [];
    initial_date = new Date();
    final_date = new Date();
    disabled = false;
    displayedColumns = ['id', 'data', 'cpf', 'name', 'payments', 'type', 'value'];

    constructor(private clientServer: ClientService,
                @Inject(LOCALE_ID) private locale: string,
                public dialog: MatDialog) {
    }

    ngOnInit() {

    }

    transformDate(date) {
        return formatDate(date, 'yyyy-MM-dd', this.locale);
    }

    openSaleDetailModal(sale: Sale) {
        this.dialog.open(SaleDetailComponent, {
            disableClose: false,
            maxHeight: '570px',
            width: '900px',
            data: {
                'sale': sale
            }
        });
        return;
    }

    onSubmit(form: NgForm) {
        this.disabled = true;
        const auxInitial = this.transformDate(form.value.initialDate);
        let auxFinal = form.value.finalDate;
        auxFinal.setDate(auxFinal.getDate() + 1);
        auxFinal = this.transformDate(auxFinal);
        const params = {
            name: form.value.name,
            initialDate: auxInitial,
            finalDate: auxFinal
        };
        async.parallel({
            sales: (callback) => {
                this.clientServer.getSales(params).subscribe(
                    (next) => callback(null, next),
                    (error) => callback(error)
                );
            },
            trades: (callback) => {
                this.clientServer.getTrades(params).subscribe(
                    (next) => callback(null, next),
                    (error) => callback(error)
                );
            }
        }, (err, results) => {
            this.sales = [...results.trades, ...results.sales];
            this.sales.sort((a, b) => {
                return (a.datetime < b.datetime) ? 1 : -1;
            });
            this.disabled = false;
        }, () => this.disabled = false);
    }
}

export interface SaleOrTradeList {
    id: number;
    datetime: Date;
    client: Client;
    value: number;
    TYPE: any;
}
