import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Sale} from '../../../models/sale.model';

import * as _ from 'lodash';
import {SaleCommunicationService} from '../../../services/sale-communication.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/state/app.state';
import {AddClient, MovePage, UpdateFullSale} from '../../../store/actions/sale.actions';
import {UpdateCheckbookWithdraw, UpdateMoneyWithdraw} from '../../../store/actions/withdraw.actions';
import {Withdraw} from '../../../models/withdraw.model';
import {ClientService} from '../../../services/client.service';
import {PopupComponent} from '../../../modals/popup/popup.component';
import {MatDialog} from '@angular/material/dialog';

const async = require('async');

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
    sale: Sale;
    newSale;
    selectedRow;
    selectedNewRow;
    ready = false;

    constructor(private router: ActivatedRoute, private saleCommunicationService: SaleCommunicationService,
                private store: Store<AppState>, private clientServer: ClientService, public dialog: MatDialog) {
    }

    ngOnInit() {
        this.sale = new Sale(JSON.parse(this.router.snapshot.queryParams.sale));
        this.store.dispatch(new AddClient(this.sale.client));
        this.newSale = new Sale({});

        async.parallel({
                money: (callback) => {
                    this.clientServer.getWithdrawInformation({name: 'Dinheiro'}).subscribe(
                        (success) => {
                            callback(null, success);
                        });
                },
                checkbook: (callback) => {
                    this.clientServer.getWithdrawInformation({name: 'Cheque'}).subscribe(
                        (success) => {
                            callback(null, success);
                        });
                }
            },
            (err, results) => {
                this.ready = true;
                this.store.dispatch(new UpdateMoneyWithdraw(new Withdraw(results.money)));
                this.store.dispatch(new UpdateCheckbookWithdraw(new Withdraw(results.checkbook)));
            });
    }

    selectSaleProduct(i) {
        if (this.selectedRow !== i) {
            this.selectedRow = i;
            this.selectedNewRow = undefined;
        } else {
            this.selectedRow = undefined;
        }
    }

    selectNewSaleProduct(i) {
        if (this.selectedNewRow !== i) {
            this.selectedNewRow = i;
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
            const hasInNewSale = _.some(_.map(this.newSale.products, 'product'), this.selectedRow.product);
            this.selectedRow.quantity -= 1;
            if (!hasInNewSale) {
                this.newSale.products.push({
                    quantity: 1,
                    value: this.selectedRow.value,
                    product: {...this.selectedRow.product}
                });
            } else {
                this.newSale.products.forEach((saleProduct) => {
                    if (_.isEqual(saleProduct.product, this.selectedRow.product)) {
                        saleProduct.quantity += 1;
                    }
                });
            }
            if (this.selectedRow.quantity === 0) {
                _.remove(this.sale.products, (p) => _.isEqual(p, this.selectedRow));
                this.selectedRow = undefined;
            }
        } else if (!forward && this.selectedNewRow) {
            const hasInNewSale = _.some(_.map(this.sale.products, 'product'), this.selectedNewRow.product);
            this.selectedNewRow.quantity -= 1;
            if (!hasInNewSale) {
                this.sale.products.push({
                    quantity: 1,
                    value: this.selectedNewRow.value,
                    product: {...this.selectedNewRow.product}
                });
            } else {
                this.sale.products.forEach((saleProduct) => {
                    if (_.isEqual(saleProduct.product, this.selectedNewRow.product)) {
                        saleProduct.quantity += 1;
                    }
                });
            }
            if (this.selectedNewRow.quantity === 0) {
                _.remove(this.newSale.products, (p) => _.isEqual(p, this.selectedNewRow));
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
            sum += p.quantity * p.product.price_sell;
        });
        return sum;
    }

}
