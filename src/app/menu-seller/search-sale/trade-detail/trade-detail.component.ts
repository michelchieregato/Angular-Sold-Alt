import {Component, Inject, OnInit} from '@angular/core';
import {Trade} from '../../../models/trade.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ClientService} from '../../../services/client.service';

export interface TradeDetailData {
    transaction: Trade;
}

@Component({
    selector: 'app-trade-detail',
    templateUrl: './trade-detail.component.html',
    styleUrls: ['./trade-detail.component.scss']
})
export class TradeDetailComponent implements OnInit {
    trade: Trade = new Trade({}, null);
    loading: boolean = false;

    constructor(public dialogRef: MatDialogRef<TradeDetailComponent>,
                @Inject(MAT_DIALOG_DATA) public data: TradeDetailData,
                private clientService: ClientService) {
    }

    ngOnInit() {
        this.trade = this.data.transaction;
        this.clientService.getTrade(this.data.transaction).subscribe(
            (trade) => {
                this.trade = trade;
                console.log(trade);
                this.loading = false;
            },
            (error) => {
                console.log(error);
                this.loading = false;
            }
        );
    }

}
