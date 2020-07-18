import {Component, Input, OnInit} from '@angular/core';
import {ClientService} from '../../../services/client.service';
import {Product} from '../../../models/product.model';
import * as _ from 'lodash';
import {MatDialog} from '@angular/material';
import {ConfirmStockComponent} from '../confirm-stock/confirm-stock.component';
import {User} from '../../../models/user.model';
import {StockType} from '../../../constants/enums';
import {PopupComponent} from '../../../modals/popup/popup.component';

declare const window: any;
const {remote} = window.require('electron');

@Component({
    selector: 'app-check-stock',
    templateUrl: './check-stock.component.html',
    styleUrls: ['./check-stock.component.scss']
})
export class CheckStockComponent implements OnInit {
    store: string;
    loading = true;
    products: Product[] = [];
    data: StockProduct[] = [];
    displayData: DisplayedProducts[] = [];
    displayedColumns = ['name', '00', '02', '04', '06', '08', '10', '12', '14', 'PP', 'P', 'M', 'G', 'GG'];
    user = new User(remote.getGlobal('user'));
    @Input() type: StockType;
    stockType = StockType;


    constructor(private clientServer: ClientService, public dialog: MatDialog) {
    }

    prepareData() {
        this.data.forEach((dataProduct) => {
            let currentDisplayData = this.displayData.find(product => product.name === dataProduct.name);
            if (currentDisplayData) {
                currentDisplayData.size[dataProduct.size] = dataProduct;
            } else {
                this.displayData.push({
                    name: dataProduct.name,
                    size: {
                        [dataProduct.size]: dataProduct
                    }
                });
            }
        });

        this.displayData.sort(
            (a, b) => {
                if (a.name < b.name) {
                    return -1;
                } else if (a.name > b.name) {
                    return 1;
                }
                return 0;
            }
        );
    }

    ngOnInit() {
        this.store = remote.getGlobal('store');
        this.clientServer.getProducts(true, false).subscribe(
            (results) => {
                this.products = results;
                this.data = this.products.map(product => {
                    let stock = 0;
                    let oldStock = product.getStock(this.store);
                    if (this.type === this.stockType.EDIT || this.type === this.stockType.VISUALIZE) {
                        stock = oldStock;
                    }
                    return {
                        id: product.id,
                        name: product.name.trim(),
                        size: product.size,
                        oldStock: oldStock,
                        stock: stock
                    };
                });
                this.prepareData();
                this.loading = false;
            });
    }

    updateStock() {
        let productsToUpdate = [];
        const hasNullValues = this.data.find(product => {
            return product.stock === null;
        });

        if (hasNullValues) {
            this.dialog.open(PopupComponent, {
                width: '625px',
                height: '350px',
                data: {
                    'type': 'ok-face',
                    'title': 'Adicione algum valor!',
                    'text': 'Pelo menos algum dos valores modificados é inválido.'
                }
            });
            return;
        }

        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].stock !== this.data[i].oldStock) {
                productsToUpdate.push(_.cloneDeep(this.data[i]));
            }
        }

        const modal = this.dialog.open(ConfirmStockComponent, {
            width: '625px',
            data: {
                'products': productsToUpdate,
            }
        });

        modal.afterClosed().subscribe(updated => {
            if (updated) {
                this.loading = true;
                this.ngOnInit();
            }
        });
    }

    addStock() {
        let productsToUpdate = [];
        let modal;
        const hasNegativeValues = this.data.find(product => {
            return product.stock < 0;
        });

        if (hasNegativeValues) {
            this.dialog.open(PopupComponent, {
                width: '625px',
                height: '350px',
                data: {
                    'type': 'ok-face',
                    'title': 'Quantidade negativa!',
                    'text': 'Você não pode adicionar quantidade negativa de produtos.'
                }
            });
            return;
        }

        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].stock !== 0) {
                productsToUpdate.push(_.cloneDeep(this.data[i]));
            }
        }

        modal = this.dialog.open(ConfirmStockComponent, {
            width: '625px',
            data: {
                'products': productsToUpdate,
                'type': this.type
            }
        });

        modal.afterClosed().subscribe(updated => {
            if (updated) {
                this.loading = true;
                this.ngOnInit();
            }
        });
    }
}

interface StockProduct {
    id: number;
    name: string;
    size: string;
    stock: number;
    oldStock: number;
}

interface DisplayedProducts {
    name: string;
    size: any;
}
