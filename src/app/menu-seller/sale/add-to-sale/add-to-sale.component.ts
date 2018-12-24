import {Component, OnInit} from '@angular/core';
import {Product} from '../../../models/product.model';
import {ClientService} from '../../../services/client.service';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AddProduct, AddSale, MovePage, RemoveProduct} from '../../../store/actions/sale.actions';
import {MatDialog} from '@angular/material/dialog';
import {AppState} from '../../../store/state/app.state';
import {selectProducts, selectSale, selectTotal} from '../../../store/selectors/sale.selectors';
import {PopupComponent} from '../../../modals/popup/popup.component';

@Component({
    selector: 'app-add-to-sale',
    templateUrl: './add-to-sale.component.html',
    styleUrls: ['./add-to-sale.component.scss']
})
export class AddToSaleComponent implements OnInit {
    products = [];
    displayProducts = [];
    product = new Product({});
    saleProducts = this.store.pipe(select(selectProducts));
    total = this.store.pipe(select(selectTotal));
    productsOnSale = [];
    qnt = 1;
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

        this.saleProducts.subscribe(
            (products) => {
                this.productsOnSale = products;

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

    addProduct() {
        this.store.dispatch(new AddProduct({
            product: this.product,
            qnt: this.qnt
        }));
        this.qnt = 1;
    }

    removeProduct(id: number) {
        this.store.dispatch(new RemoveProduct(id));
    }

    endSale(isOrder) {
        if (!this.productsOnSale.length) {
            this.dialog.open(PopupComponent, {
                height: '400px',
                width: '500px',
                data: {
                    'type': 'ok-face',
                    'title': 'Venda algum produto!',
                    'text': 'Não se esqueça de adicionar produtos a venda.'
                }
            });
            return;
        }

        if (!isOrder.checked) {
            this.store.dispatch(new MovePage(true));
        }
    }

}
