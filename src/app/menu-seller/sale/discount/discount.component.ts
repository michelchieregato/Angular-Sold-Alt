import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../../modals/popup/popup.component';
import {ClientService} from '../../../services/client.service';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../store/state/app.state';
import {selectDiscount} from '../../../store/selectors/sale.selectors';
import {UpdateDiscount} from '../../../store/actions/sale.actions';

@Component({
    selector: 'app-discount',
    templateUrl: './discount.component.html',
    styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {

    discount = 0;
    listenDiscount = this.store.pipe(select(selectDiscount));

    constructor(public dialogRef: MatDialogRef<DiscountComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData,
                private store: Store<AppState>) {
    }

    ngOnInit() {
        this.listenDiscount.subscribe(
            (discount) => {
                this.discount = discount;
            }
        );
    }

    applyDiscount() {
        this.store.dispatch(new UpdateDiscount(this.discount));
        this.closeModal();
    }

    closeModal(): void {
        this.dialogRef.close();
    }


}
