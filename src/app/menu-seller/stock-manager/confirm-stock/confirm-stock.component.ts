import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ClientService} from '../../../services/client.service';
import {StockType} from '../../../constants/enums';

interface ConfirmData {
    products: Array<StockProduct>;
    type: StockType;
}

@Component({
    selector: 'app-confirm-stock',
    templateUrl: './confirm-stock.component.html',
    styleUrls: ['./confirm-stock.component.scss']
})
export class ConfirmStockComponent implements OnInit {
    products: Array<StockProduct> = [];
    columns = ['name', 'size', 'oldQuantity', 'quantity'];
    disabled = false;
    type: StockType;
    stockOptions = StockType;

    constructor(private clientServer: ClientService,
                public dialogRef: MatDialogRef<ConfirmStockComponent>,
                @Inject(MAT_DIALOG_DATA) public data: ConfirmData) {
    }

    ngOnInit() {
        this.type = this.data.type;
        if (this.type === StockType.ADD) {
            this.columns = ['name', 'size', 'oldQuantity', 'addedQuantity', 'quantity'];
        }
        this.products = this.data.products;
        if (this.type === StockType.ADD) {
            // Se é para adicionar, o estoque final é adicionado
            this.products.forEach(
                (product) => {
                    product.addedStock = product.stock;
                    product.stock += product.oldStock;
                }
            );
        }
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
    addedStock: number;
    oldStock: number;
}
