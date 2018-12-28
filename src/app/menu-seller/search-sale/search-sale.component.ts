import {Component, Inject, Input, LOCALE_ID, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ClientService} from '../../services/client.service';
import {Sale} from '../../models/sale.model';
import {formatDate} from '@angular/common';
import {DiscountComponent} from '../sale/discount/discount.component';
import {MatDialog} from '@angular/material/dialog';
import {SaleDetailComponent} from './sale-detail/sale-detail.component';

@Component({
    selector: 'app-search-sale',
    templateUrl: './search-sale.component.html',
    styleUrls: ['./search-sale.component.scss']
})
export class SearchSaleComponent implements OnInit {
    sales = [];
    initial_date = new Date();
    final_date = new Date();
    disabled = false;

    constructor(private clientServer: ClientService, @Inject(LOCALE_ID) private locale: string, public dialog: MatDialog) {
    }

    ngOnInit() {
    }

    transformDate(date) {
        return formatDate(date, 'yyyy-MM-dd', this.locale);
    }

    openSaleDetailModal(sale: Sale) {
        this.dialog.open(SaleDetailComponent, {
            disableClose: false,
            maxHeight: '500px',
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
        this.clientServer.getSales({
            name: form.value.name,
            initialDate: auxInitial,
            finalDate: auxFinal
        }).subscribe(
            (next) => {
                this.sales = next;
                this.disabled = false;
            },
            (error) => {
                console.log(error);
                this.disabled = false;
            }
        );
    }
}
