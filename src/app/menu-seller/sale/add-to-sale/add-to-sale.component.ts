import {Component, KeyValueDiffer, KeyValueDiffers, OnInit} from '@angular/core';
import {Product} from '../../../models/product.model';
import {ClientService} from '../../../services/client.service';
import {select, Store} from '@ngrx/store';
import {MovePage, RestartSale, UpdateFullSale} from '../../../store/actions/sale.actions';
import {MatDialog} from '@angular/material/dialog';
import {AppState} from '../../../store/state/app.state';
import {selectSale, selectTotal} from '../../../store/selectors/sale.selectors';
import {PopupComponent} from '../../../modals/popup/popup.component';
import {Sale} from '../../../models/sale.model';

const async = require('async');

@Component({
    selector: 'app-add-to-sale',
    templateUrl: './add-to-sale.component.html',
    styleUrls: ['./add-to-sale.component.scss']
})
export class AddToSaleComponent implements OnInit {
    sale: Sale;
    products = [];
    displayProducts = [];
    product = new Product({});
    total = this.store.pipe(select(selectTotal));
    saleObserver = this.store.pipe(select(selectSale));
    saleDiffer: KeyValueDiffer<any, any>;
    qnt = 1;
    ready = false;
    new = false;

    constructor(private clientServer: ClientService, private store: Store<AppState>,
                public dialog: MatDialog, private _differs: KeyValueDiffers) {
        this.sale = new Sale({});
        this.saleDiffer = this._differs.find(this.sale).create();
    }


    ngOnInit() {
        this.clientServer.getProducts().subscribe(
            (results) => {
                this.products = results;
                this.displayProducts = this.products;
                this.product = this.products[0];
                this.ready = true;
            });

        this.saleObserver.subscribe(
            (sale) => {
                this.sale = new Sale(sale);
                this.sale.value = this.sale.original_value;
            }
        );
    }

    updatePanel(product) {
        this.product = product;
    }

    getStock(product) {
        if (!product.stock) {
            this.clientServer.getStockProduct(product.id).subscribe((response) => {
                product.setStock(response['stock']);
            });
        }
    }

    searchProduct(searchValue: string) {
        this.displayProducts = this.products.filter(product => {
            return product.name.toLowerCase().includes(searchValue.toLowerCase());
        });

        if (this.new) {
            this.displayProducts = this.displayProducts.filter(product => {
                return !product.name.includes('*(A)');
            });
        }
    }

    addProduct() {
        console.log(this.qnt);
        this.sale.addProduct(this.product, this.qnt);
        this.store.dispatch(new UpdateFullSale(this.sale));
        this.qnt = 1;
    }

    removeProduct(id: number) {
        this.sale.removeProducts(id);
        this.store.dispatch(new UpdateFullSale(this.sale));
    }

    endSale(isOrder) {
        if (!this.sale.products.length) {
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
        } else {
            this.sale.finish_later = true;
            this.ready = false;
            this.clientServer.finishSale(this.sale.prepareToSendSale([])).subscribe(
                (next) => {
                    console.log(next);
                    this.dialog.open(PopupComponent, {
                        height: '400px',
                        width: '500px',
                        data: {
                            'type': 'happy',
                            'title': 'Pronto!',
                            'text': 'Encomenda realizada com sucesso.'
                        }
                    });
                    this.store.dispatch(new RestartSale());
                    this.ready = true;
                    isOrder.checked = false;
                },
                (err) => {
                    console.log(err);
                    this.dialog.open(PopupComponent, {
                        height: '400px',
                        width: '500px',
                        data: {
                            'type': 'sad',
                            'title': 'Não foi possível realizar a encomenda!',
                            'text': 'Verifique a conexao.'
                        }
                    });
                    this.store.dispatch(new RestartSale());
                    this.ready = true;
                }
            );
        }
    }

}
