import {Component, OnInit} from '@angular/core';
import {Product} from '../../../models/product.model';
import {Client} from '../../../models/client.model';
import {ClientService} from '../../../services/client.service';
import {Sale} from '../../../models/sale.model';
import {User} from '../../../models/user.model';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AddSale, MovePage} from '../state/sale.actions';
import {AppState} from '../state/sale.reducers';
import {PopupComponent} from '../../../modals/popup/popup.component';
import {MatDialog} from '@angular/material/dialog';

declare const window: any;
const { remote } = window.require('electron');

@Component({
  selector: 'app-add-to-sale',
  templateUrl: './add-to-sale.component.html',
  styleUrls: ['./add-to-sale.component.scss']
})
export class AddToSaleComponent implements OnInit {
    products = [];
    displayProducts = [];
    saleProducts = [];
    product = new Product({});
    client: Observable<AppState>;
    qnt = 1;
    total = 0;
    ready = false;

    ngOnInit() {
        this.clientServer.getProducts().subscribe(
            (response) => {
                this.products = response;
                this.displayProducts = this.products;
                this.product = this.products[0];
                this.ready = true;
            }
        );
    }

    constructor(private clientServer: ClientService, private store: Store<AppState>, public dialog: MatDialog) {
    }

    updatePanel(product) {
        this.product = product;
    }

    searchProduct(searchValue: string) {
        this.displayProducts = this.products.filter(product => {
            return product.name.toLowerCase().includes(searchValue.toLowerCase());
        });
    }

    private getProductOnSaleList(id) {
        return this.saleProducts.filter(saleProduct => {
            return saleProduct.id === id;
        });
    }

    private getSaleValue() {
        if (this.saleProducts.length) {
            this.total =  this.saleProducts.map(saleProduct => {
                return (saleProduct.quantity * saleProduct.price_sell);
            }).reduce((a, b) => {
                return a + b;
            });
        } else {
            this.total = 0;
        }
    }

    addProduct() {
        if (this.getProductOnSaleList(this.product.id).length) {
            this.getProductOnSaleList(this.product.id)[0].quantity += this.qnt;
        } else {
            this.product.quantity = this.qnt;
            this.saleProducts.push(this.product);
        }
        this.getSaleValue();
        this.qnt = 1;
    }

    removeProduct(id: number) {
        this.saleProducts = this.saleProducts.filter(saleProduct => {
            return saleProduct.id !== id;
        });
        this.getSaleValue();
    }

    endSale(isOrder) {
        if (!this.saleProducts.length) {
            this.dialog.open(PopupComponent, {
                data: {
                    'type': 'ok-face',
                    'title': 'Venda algum produto!',
                    'text': 'Não se esqueça de adicionar produtos a venda.'
                }
            });
            return;
        }
        const sale = new Sale({
            user: new User(remote.getGlobal('user')),
            store: remote.getGlobal('store'),
            value: this.total,
            finish_later: isOrder.checked
        });
        this.store.dispatch(new AddSale(sale));
        this.store.dispatch(new MovePage(true));
    }

}
