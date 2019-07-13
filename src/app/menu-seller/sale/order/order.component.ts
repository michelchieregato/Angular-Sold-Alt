import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Sale} from '../../../models/sale.model';

import * as _ from 'lodash';
import {SaleCommunicationService} from '../../../services/sale-communication.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/state/app.state';
import {AddClient, MovePage, UpdateFullSale} from '../../../store/actions/sale.actions';
import {PopupComponent} from '../../../modals/popup/popup.component';
import {MatDialog} from '@angular/material/dialog';
import {Product} from '../../../models/product.model';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
    sale: Sale;
    newSale;
    selectedRow: Product;
    selectedNewRow;
    ready = false;

    constructor(private router: ActivatedRoute, private saleCommunicationService: SaleCommunicationService,
                private store: Store<AppState>, public dialog: MatDialog) {
    }

    ngOnInit() {
        this.sale = new Sale(JSON.parse(this.router.snapshot.queryParams.sale));
        this.store.dispatch(new AddClient(this.sale.client));
        this.newSale = new Sale({});
        this.ready = true;
    }

    selectSaleProduct(product: Product) {
        if (this.selectedRow !== product) {
            this.selectedRow = product;
            this.selectedNewRow = undefined;
        } else {
            this.selectedRow = undefined;
        }
    }

    selectNewSaleProduct(product: Product) {
        if (this.selectedNewRow !== product) {
            this.selectedNewRow = product;
            this.selectedRow = undefined;
        } else {
            this.selectedNewRow = undefined;
        }
    }

    transferAllObjects(forward: boolean) {
        if (forward && this.selectedRow) {
            while (this.selectedRow) {
                this.transferOneObject(true);
            }
        } else if (!forward && this.selectedNewRow) {
            while (this.selectedNewRow) {
                this.transferOneObject(false);
            }
        }
    }

    transferOneObject(forward: boolean) {
        if (forward && this.selectedRow) {
            this.newSale.addProduct(this.selectedRow, 1);
            this.sale.removeProduct(this.selectedRow.id, 1);

            if (!this.sale.getProductOnSaleList(this.selectedRow.id)) {
                this.selectedRow = undefined;
            }
        } else if (!forward && this.selectedNewRow) {
            this.sale.addProduct(this.selectedNewRow, 1);
            this.newSale.removeProduct(this.selectedNewRow.id, 1);

            if (!this.newSale.getProductOnSaleList(this.selectedNewRow.id)) {
                this.selectedNewRow = undefined;
            }
        }
    }

    endSale() {
        if (!this.newSale.products.length) {
            this.dialog.open(PopupComponent, {
                height: '400px',
                width: '500px',
                data: {
                    'type': 'ok-face',
                    'title': 'Adicione algum produto!',
                    'text': 'Não se esqueça de adicionar os produtos da encomenda.'
                }
            });
            return;
        }

        this.sale = new Sale({
            ...this.sale,
            original_value: this.calculateValue(this.sale),
            value: this.calculateValue(this.sale)
        });
        this.newSale = new Sale({
            ...this.sale,
            products: this.newSale.products,
            original_value: this.calculateValue(this.newSale),
            value: this.calculateValue(this.newSale),
            discount: 0
        });

        this.saleCommunicationService.setUpdatedSale(this.sale);
        this.store.dispatch(new UpdateFullSale(this.newSale));
        this.store.dispatch(new MovePage(true));
    }

    calculateValue(sale: Sale) {
        let sum = 0;
        sale.products.forEach((p) => {
            sum += p.quantity * p.price_sell;
        });
        return Math.round(sum * 100) / 100;
    }

}
