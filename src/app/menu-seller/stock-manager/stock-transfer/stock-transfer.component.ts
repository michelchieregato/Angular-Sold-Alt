import {Component, OnInit} from '@angular/core';
import { getStoreOptions } from 'src/app/utils';
import {ClientService} from '../../../services/client.service';
import {TypeaheadMatch} from 'ngx-bootstrap';
import {Product} from '../../../models/product.model';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmTransferComponent} from '../confirm-transfer/confirm-transfer.component';
import {PopupComponent} from '../../../modals/popup/popup.component';

declare const window: any;
const {remote} = window.require('electron');

@Component({
    selector: 'app-stock-transfer',
    templateUrl: './stock-transfer.component.html',
    styleUrls: ['./stock-transfer.component.scss']
})
export class StockTransferComponent implements OnInit {
    ready = false;
    disabled = false;
    typeaheadText;
    selectedItem: Product;
    qnt = 1;
    products = [];
    selectedProducts = [];
    currentStore = remote.getGlobal('store');
    stores = [];
    store: string;

    constructor(private clientServer: ClientService, public dialog: MatDialog) {
    }

    ngOnInit() {
        this.stores = getStoreOptions(false);
        this.clientServer.getProducts(true, false).subscribe(
            (response) => {
                this.products = response;
                this.ready = true;
            }
        );
    }

    get storesOptions() {
        return this.stores.filter(store => store !== this.currentStore);
    }

    onTypeaheadSelect(e: TypeaheadMatch) {
        this.selectedItem = new Product(e.item);
        this.typeaheadText += (' ' + e.item.size);
    }

    private getProductOnList(id) {
        return this.selectedProducts.filter(saleProduct => {
            return saleProduct.id === id;
        });
    }

    private addProduct(product, qnt) {
        const getProduct = this.getProductOnList(product.id);
        if (getProduct.length) {
            getProduct[0].quantity += qnt;
        } else {
            this.selectedProducts.push(new StockTransferProduct(product, qnt));
        }
    }

    removeProduct(id: number) {
        this.selectedProducts = this.selectedProducts.filter(saleProduct => {
            return saleProduct.id !== id;
        });
    }

    add() {
        this.addProduct(this.selectedItem, this.qnt);
        this.qnt = 1;
    }

    updateStock() {
        if (this.selectedProducts.length <= 0) {
            this.dialog.open(PopupComponent, {
                width: '625px',
                height: '350px',
                data: {
                    'type': 'ok-face',
                    'title': 'Nenhum produto selecionado!',
                    'text': 'Adicione algum produto.'
                }
            });
            return;
        } else if (!this.store) {
            this.dialog.open(PopupComponent, {
                width: '625px',
                height: '350px',
                data: {
                    'type': 'ok-face',
                    'title': 'Nenhuma loja selecionada!',
                    'text': 'Selecione.'
                }
            });
            return;
        }

        const modal = this.dialog.open(ConfirmTransferComponent, {
            width: '750px',
            data: {
                products: this.selectedProducts,
                currentStore: this.currentStore,
                newStore: this.store
            }
        });

        modal.afterClosed().subscribe(updated => {
            if (updated) {
                this.ready = false;
                this.selectedProducts = [];
                this.typeaheadText = undefined;
                this.dialog.open(PopupComponent, {
                    width: '625px',
                    height: '350px',
                    data: {
                        'type': 'happy',
                        'title': 'Transferencia feita com sucesso!'
                    }
                });
                this.ngOnInit();
            }
        });
    }
}


export class StockTransferProduct {
    product: Product;
    quantity: number;

    constructor(product: Product, quantity: number) {
        this.product = product;
        this.quantity = quantity;
    }

    get id() {
        return this.product.id;
    }

    get name() {
        return this.product.name;
    }

    get size() {
        return this.product.size;
    }

    getNewStoreStock(store: string) {
        return this.product.getStock(store) + this.quantity;
    }

    getCurrentStoreStock(store: string) {
        return this.product.getStock(store) - this.quantity;
    }
}
