import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../store/state/app.state';
import {selectDiscount} from '../../../store/selectors/sale.selectors';
import {UpdateDiscount, UpdateFullSale} from '../../../store/actions/sale.actions';
import {TypeOfSale} from '../../../constants/enums';
import {UpdateFullTrade, UpdateTradeDiscount} from '../../../store/actions/trade.actions';
import {selectTradeDiscount} from '../../../store/selectors/trade.selectors';
import {Sale} from '../../../models/sale.model';
import {Trade} from '../../../models/trade.model';
import * as _ from 'lodash';

@Component({
    selector: 'app-discount',
    templateUrl: './discount.component.html',
    styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {

    discount = 0;
    listenDiscount: any;
    transaction: Sale | Trade;
    clientDiscount = 0;
    checked = false;

    constructor(public dialogRef: MatDialogRef<DiscountComponent>,
                @Inject(MAT_DIALOG_DATA) public data: Sale | Trade,
                private store: Store<AppState>) {
    }

    ngOnInit() {
        this.transaction = _.cloneDeep(this.data);

        if (this.transaction.clientDiscount) {
            this.clientDiscount = this.transaction.clientDiscount;
            this.transaction.clientDiscount = 0;
            this.checked = true;
        } else {
            this.clientDiscount = this.transaction.getClientDiscount();
        }

        if (this.transaction.TYPE === TypeOfSale.SALE) {
            this.listenDiscount = this.store.pipe(select(selectDiscount));
        } else {
            this.listenDiscount = this.store.pipe(select(selectTradeDiscount));
        }

        this.listenDiscount.subscribe(
            (discount) => {
                this.discount = discount;
            }
        );
    }

    applyDiscount() {

        if (this.checked) {
            this.transaction.clientDiscount = this.clientDiscount;
        }

        this.transaction.discount = this.discount;
        this.transaction.value = this.transaction.calculateValue();
        console.log(this.transaction.getClientDiscount());
        console.log(this.transaction);

        if (this.transaction.TYPE === TypeOfSale.SALE) {
            this.store.dispatch(new UpdateFullSale(this.transaction));
        } else {
            this.store.dispatch(new UpdateFullTrade(this.transaction));
        }

        this.closeModal();
    }

    closeModal(): void {
        this.dialogRef.close();
    }

    onSlideChange() {
        this.transaction.discount = this.discount;
        this.transaction.value = this.transaction.calculateValue();
        this.clientDiscount = this.transaction.getClientDiscount();
    }


}
