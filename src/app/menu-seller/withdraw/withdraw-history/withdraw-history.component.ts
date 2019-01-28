import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ClientService} from '../../../services/client.service';
import {WithdrawHistory} from '../../../models/withdraw-history.model';

@Component({
    selector: 'app-withdraw-history',
    templateUrl: './withdraw-history.component.html',
    styleUrls: ['./withdraw-history.component.scss']
})
export class WithdrawHistoryComponent implements OnInit {

    selector = '.scroll';

    withdrawHistory = [];
    loading = true;
    withdraws = true;
    sales = false;
    deposits = true;
    page = 1;

    constructor(public dialogRef: MatDialogRef<WithdrawHistoryComponent>, private clientService: ClientService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        this.clientService.getWithdrawHistory(this.page, {
            withdraws: this.withdraws,
            sales: this.sales,
            deposits: this.deposits
        }).subscribe(
            (response) => {
                this.withdrawHistory = response.map(w => new WithdrawHistory(w));
                this.loading = false;
                console.log(this.withdrawHistory);
            }
        );
    }

    search() {
        this.loading = true;
        this.page = 1;
        this.clientService.getWithdrawHistory(this.page, {
            withdraws: this.withdraws,
            sales: this.sales,
            deposits: this.deposits
        }).subscribe(
            (response) => {
                this.withdrawHistory = response.map(w => new WithdrawHistory(w));
                this.loading = false;
                console.log(this.withdrawHistory);
            },
            (err) => {
                this.loading = false;
            }
        );
    }

    onScroll() {
        this.loading = true;
        this.page += 1;
        this.clientService.getWithdrawHistory(this.page, {
            withdraws: this.withdraws,
            sales: this.sales,
            deposits: this.deposits
        }).subscribe(
            (response) => {
                this.withdrawHistory = this.withdrawHistory.concat(response.map(w => new WithdrawHistory(w)));
                this.loading = false;
                console.log(this.withdrawHistory);
            },
            (err) => {
                this.loading = false;
            }
        );
    }

}
