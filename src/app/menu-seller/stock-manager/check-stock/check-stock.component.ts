import {Component, OnInit} from '@angular/core';
import {ClientService} from '../../../services/client.service';
import {Product} from '../../../models/product.model';
import * as _ from 'lodash';
import {MatDialog} from '@angular/material';
import {ConfirmStockComponent} from '../confirm-stock/confirm-stock.component';
import {User} from '../../../models/user.model';

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
    copyOfData: StockProduct[] = [];
    displayData: DisplayedProducts[] = [];
    displayedColumns = ['name', '00', '02', '04', '06', '08', '10', '12', '14', 'PP', 'P', 'M', 'G', 'GG'];
    user = new User(remote.getGlobal('user'));
    editMode = false;


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
        if (this.user.is_admin) {
            this.editMode = true;
        }
        this.store = remote.getGlobal('store');
        this.clientServer.getProducts().subscribe(
            (results) => {
                this.products = results.filter(product => {
                    return !product.name.includes('*(A)');
                });
                this.data = this.products.map(product => {
                    return {
                        id: product.id,
                        name: product.name.trim(),
                        size: product.size,
                        stock: product.getStock(this.store)
                    };
                });
                this.copyOfData = _.cloneDeep(this.data);
                this.prepareData();
                this.loading = false;
            });
    }

    updateStock() {
        let productsToUpdate = [];
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].stock !== this.copyOfData[i].stock) {
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
}

interface StockProduct {
    id: number;
    name: string;
    size: string;
    stock: number;
}

interface DisplayedProducts {
    name: string;
    size: any;
}
