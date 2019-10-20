import {Component, OnInit} from '@angular/core';
import {ClientService} from '../../../services/client.service';
import {TypeaheadMatch} from 'ngx-bootstrap';
import {Product} from '../../../models/product.model';
import {PopupComponent} from '../../../modals/popup/popup.component';
import {MatDialog} from '@angular/material/dialog';

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
    store = 'Verbo Divino';

    constructor(private clientServer: ClientService, public dialog: MatDialog) {
    }

    ngOnInit() {
        this.clientServer.getProducts().subscribe(
            (response) => {
                this.products = response;
                this.ready = true;
            }
        );
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
            product.quantity = qnt;
            this.selectedProducts.push(product);
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
        this.disabled = true;
        const productsToSend = {};
        this.selectedProducts.forEach((product) => {
            productsToSend[product.id] = product.quantity;
        });
        const data = {
            to_store: this.store,
            products: productsToSend,
        };
        this.clientServer.updateStock(data).subscribe(
            (n) => {
                console.log(n);
                this.disabled = false;
                this.selectedProducts = [];
                this.typeaheadText = undefined;
                this.dialog.open(PopupComponent, {
                    height: '400px',
                    width: '500px',
                    data: {
                        'type': 'happy',
                        'title': 'Transferência de estoque realizada com sucesso!',
                        'text': 'Os produtos foram transferidos. Para ver o historico de transferências, clicke em Ver histórico.'
                    }
                });
            },
            (e) => {
                console.log(e);
                this.disabled = false;
            });
    }
}
