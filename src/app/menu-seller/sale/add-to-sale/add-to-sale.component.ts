import {Component, OnInit} from '@angular/core';
import {Product} from '../../../models/product.model';
import {ClientService} from '../../../services/client.service';
import {select, Store} from '@ngrx/store';
import {AddProduct, MovePage, RemoveProduct, RestartSale} from '../../../store/actions/sale.actions';
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
export class AddToSaleComponent implements OnInit {
    sale: Sale;
    products = [];
    displayProducts = [];
    product = new Product({});
    saleProducts = this.store.pipe(select(selectProducts));
    total = this.store.pipe(select(selectTotal));
    saleObserver = this.store.pipe(select(selectSale));
    productsOnSale = [];
    qnt = 1;
    ready = false;

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


        this.saleProducts.subscribe(
            (products) => {
                this.productsOnSale = products;

            }
        );

        this.saleObserver.subscribe(
            (sale) => {
                this.sale = new Sale(sale);
                this.sale.value = this.sale.original_value;
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
