import {Component, Inject, OnInit} from '@angular/core';
import {ClientService} from '../../../services/client.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {StockTransferProduct} from '../stock-transfer/stock-transfer.component';

interface ConfirmData {
    products: Array<StockTransferProduct>;
    currentStore: string;
    newStore: string;
}

@Component({
    selector: 'app-confirm-transfer',
    templateUrl: './confirm-transfer.component.html',
    styleUrls: ['./confirm-transfer.component.scss']
})
export class ConfirmTransferComponent implements OnInit {
    columns = ['name', 'size', 'quantity', 'currentStoreQuantity', 'newStoreQuantity'];
    currentStore: string;
    newStore: string;
    products: Array<StockTransferProduct>;
    disabled = false;

    constructor(private clientServer: ClientService, public dialogRef: MatDialogRef<ConfirmTransferComponent>,
                @Inject(MAT_DIALOG_DATA) public data: ConfirmData) {
    }

    ngOnInit() {
        this.currentStore = this.data.currentStore;
        this.newStore = this.data.newStore;
        this.products = this.data.products;
    }

    closeModal(confirmation?: boolean): void {
        this.dialogRef.close(confirmation);
    }

    confirmTransfer() {
        const productsToSend = {};
        this.products.forEach((product) => {
            productsToSend[product.id] = product.quantity;
        });
        const data = {
            to_store: this.newStore,
            products: productsToSend
        };
        this.clientServer.updateStock(data).subscribe(
            () => {
                this.closeModal(true);
            },
            (e) => {
                console.log(e);
                this.disabled = false;
            });
    }
}
