import {Component, DoCheck, KeyValueDiffer, KeyValueDiffers, OnChanges, OnInit} from '@angular/core';
import {Product} from '../../../models/product.model';
import {ClientService} from '../../../services/client.service';
import {select, Store} from '@ngrx/store';
import {MovePage, RestartSale, UpdateFullSale} from '../../../store/actions/sale.actions';
import {MatDialog} from '@angular/material/dialog';
import {AppState} from '../../../store/state/app.state';
import {selectProducts, selectSale, selectTotal} from '../../../store/selectors/sale.selectors';
import {PopupComponent} from '../../../modals/popup/popup.component';
import {UpdateCheckbookWithdraw, UpdateMoneyWithdraw} from '../../../store/actions/withdraw.actions';
import {Withdraw} from '../../../models/withdraw.model';
import {Sale} from '../../../models/sale.model';

const async = require('async');

@Component({
    selector: 'app-add-to-sale',
    templateUrl: './add-to-sale.component.html',
    styleUrls: ['./add-to-sale.component.scss']
})
export class AddToSaleComponent implements OnInit, DoCheck {
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
        async.parallel({
                products: (callback) => {
                    this.clientServer.getProducts().subscribe(
                        (success) => {
                            callback(null, success);
                        });
                },
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
                this.products = results.products;
                this.displayProducts = this.products;
                this.product = this.products[0];
                this.store.dispatch(new UpdateMoneyWithdraw(new Withdraw(results.money)));
                this.store.dispatch(new UpdateCheckbookWithdraw(new Withdraw(results.checkbook)));
                this.ready = true;
            });

        this.saleObserver.subscribe(
            (sale) => {
                this.sale = new Sale(sale);
                this.sale.value = this.sale.original_value;
            }
        );
    }

    ngDoCheck() {
        const changes = this.saleDiffer.diff(this.sale);
        if (changes) {
            this.store.dispatch(new UpdateFullSale(this.sale));
        }
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
        this.sale.addProduct(this.product, this.qnt);
        this.qnt = 1;
    }

    removeProduct(id: number) {
        this.sale.removeProduct(id);
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
            this.clientServer.finishSale(this.sale.prepareToSendSale([], false)).subscribe(
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
