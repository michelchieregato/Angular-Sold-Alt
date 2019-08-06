import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../../modals/popup/popup.component';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../store/state/app.state';
import {selectDiscount} from '../../../store/selectors/sale.selectors';
import {UpdateDiscount} from '../../../store/actions/sale.actions';
import {TypeOfSale} from '../../../constants/enums';
import {UpdateTradeDiscount} from '../../../store/actions/trade.actions';
import {selectTradeDiscount} from '../../../store/selectors/trade.selectors';

@Component({
    selector: 'app-discount',
    templateUrl: './discount.component.html',
    styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {

    discount = 0;
    listenDiscount: any;

    constructor(public dialogRef: MatDialogRef<DiscountComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData,
                private store: Store<AppState>) {
    }

    ngOnInit() {
        if (this.data.type === TypeOfSale.SALE) {
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
        if (this.data.type === TypeOfSale.SALE) {
            this.store.dispatch(new UpdateDiscount(this.discount));
        } else {
            this.store.dispatch(new UpdateTradeDiscount(this.discount));
        }

        this.closeModal();
    }

    closeModal(): void {
        this.dialogRef.close();
    }


}
