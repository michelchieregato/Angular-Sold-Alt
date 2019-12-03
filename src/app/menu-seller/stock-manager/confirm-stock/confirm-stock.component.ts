import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ClientService} from '../../../services/client.service';

interface ConfirmData {
    products: Array<StockProduct>;
}

@Component({
    selector: 'app-confirm-stock',
    templateUrl: './confirm-stock.component.html',
    styleUrls: ['./confirm-stock.component.scss']
})
export class ConfirmStockComponent implements OnInit {
    products: Array<StockProduct> = [];
    columns = ['name', 'size', 'quantity'];
    disabled = false;

    constructor(private clientServer: ClientService,
                public dialogRef: MatDialogRef<ConfirmStockComponent>,
                @Inject(MAT_DIALOG_DATA) public data: ConfirmData) {
    }

    ngOnInit() {
        this.products = this.data.products;
        console.log(this.products);
    }

    closeModal(confirmation: boolean | undefined): void {
        this.dialogRef.close(confirmation);
    }

    updateStock() {
        const productsToSend = {};
        this.disabled = true;

        this.products.forEach((product) => {
            productsToSend[product.id] = product.stock;
        });

        const data = {products: productsToSend};
        this.clientServer.updateStock(data).subscribe(
            () => {
                this.closeModal(true);
                this.disabled = false;
            },
            (error) => console.log(error)
        );

    }

}

interface StockProduct {
    id: number;
    name: string;
    size: string;
    stock: number;
}