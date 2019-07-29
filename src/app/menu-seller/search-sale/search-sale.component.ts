import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {ClientService} from '../../services/client.service';
import {Sale} from '../../models/sale.model';
import {formatDate, registerLocaleData} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {SaleDetailComponent} from './sale-detail/sale-detail.component';
import {Client} from '../../models/client.model';
import {DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter} from '@angular/material';
import ptBr from '@angular/common/locales/pt';
import {Trade} from '../../models/trade.model';
import {TypeOfSale} from '../../constants/enums';
import {TradeDetailComponent} from './trade-detail/trade-detail.component';

registerLocaleData(ptBr);

const async = require('async');

export class AppDateAdapter extends NativeDateAdapter {
    parse(value: any): Date | null {
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }

    format(date: Date, displayFormat: any): string {
        if (displayFormat == 'input') {
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
        } else {
            return date.toDateString();
        }
    }

    private _to2digit(n: number) {
        return ('00' + n).slice(-2);
    }
}

export const APP_DATE_FORMATS =
    {
        parse: {
            dateInput: {month: 'short', year: 'numeric', day: 'numeric'}
        },
        display: {
            // dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
            dateInput: 'input',
            // monthYearLabel: { month: 'short', year: 'numeric', day: 'numeric' },
            monthYearLabel: 'inputMonth',
            dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
            monthYearA11yLabel: {year: 'numeric', month: 'long'},
        }
    };

@Component({
    selector: 'app-search-sale',
    templateUrl: './search-sale.component.html',
    styleUrls: ['./search-sale.component.scss'],
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class SearchSaleComponent implements OnInit {
    sales: SaleOrTradeList[] = [];
    initial_date = new FormControl(new Date());
    final_date = new FormControl(new Date());
    disabled = false;
    displayedColumns = ['id', 'data', 'cpf', 'name', 'payments', 'type', 'value'];
    options = {
        sale: true,
        order: true,
        trade: false,
    };


    constructor(private clientServer: ClientService,
                @Inject(LOCALE_ID) private locale: string,
                public dialog: MatDialog) {
    }

    ngOnInit() {

    }

    transformDate(date) {
        return formatDate(date, 'yyyy-MM-dd', this.locale);
    }

    openSaleDetailModal(transaction: Sale | Trade) {
        const component: any = transaction.TYPE === TypeOfSale.TRADE ? TradeDetailComponent : SaleDetailComponent;

        this.dialog.open(component, {
            disableClose: false,
            maxHeight: '570px',
            width: '900px',
            data: {
                'transaction': transaction
            }
        });
        return;
    }

    onSubmit(form: NgForm) {
        this.disabled = true;
        const auxInitial = this.transformDate(this.initial_date.value);
        let auxFinal = this.final_date.value;
        auxFinal.setDate(auxFinal.getDate() + 1);
        auxFinal = this.transformDate(auxFinal);
        const params = {
            name: form.value.name,
            initialDate: auxInitial,
            finalDate: auxFinal
        };
        async.parallel({
            sales: (callback) => {
                console.log(this.options);
                if (this.options.sale || this.options.order) {
                    params['sale'] = Boolean(this.options.sale);
                    params['order'] = this.options.order;
                    this.clientServer.getSales(params).subscribe(
                        (next) => callback(null, next),
                        (error) => callback(error)
                    );
                } else {
                    callback(null, []);
                }

            },
            trades: (callback) => {
                if (this.options.trade) {
                    this.clientServer.getTrades(params).subscribe(
                        (next) => callback(null, next),
                        (error) => callback(error)
                    );
                } else {
                    callback(null, []);
                }
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
