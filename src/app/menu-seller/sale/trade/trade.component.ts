import {Component, DoCheck, KeyValueDiffer, KeyValueDiffers, OnInit} from '@angular/core';
import {Sale} from '../../../models/sale.model';
import {ActivatedRoute} from '@angular/router';
import {AddClient, MovePage, UpdateFullSale} from '../../../store/actions/sale.actions';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/state/app.state';
import {ClientService} from '../../../services/client.service';
import {Product} from '../../../models/product.model';
import {TypeaheadMatch} from 'ngx-bootstrap';
import {Trade} from '../../../models/trade.model';
import {UpdateFullTrade} from '../../../store/actions/trade.actions';
import {PopupComponent} from '../../../modals/popup/popup.component';
import {MatDialog} from '@angular/material';

@Component({
    selector: 'app-trade',
    templateUrl: './trade.component.html',
    styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements OnInit, DoCheck {
    ready: boolean = false;
    sale: Sale;
    products: Array<Product> = [];
    typeaheadItem: Product;
    typeaheadText;
    trade: Trade;
    returnProductRow: Product;
    keepProductRow: Product;
    tradeDiffer: KeyValueDiffer<any, any>;

    constructor(private router: ActivatedRoute, private store: Store<AppState>, private clientServer: ClientService,
                private _differs: KeyValueDiffers, public dialog: MatDialog) {
        this.trade = new Trade({}, new Sale({}));
        this.tradeDiffer = this._differs.find(this.trade).create();
    }

    selectReturnProduct(product: Product) {
        if (this.returnProductRow !== product) {
            this.returnProductRow = product;
            this.keepProductRow = undefined;
        } else {
            this.returnProductRow = undefined;
        }
    }

    selectKeepProduct(product: Product) {
        if (this.keepProductRow !== product) {
            this.keepProductRow = product;
            this.returnProductRow = undefined;
        } else {
            this.keepProductRow = undefined;
        }
    }

    ngOnInit() {
        this.sale = new Sale(JSON.parse(this.router.snapshot.queryParams.sale));
        this.store.dispatch(new AddClient(this.sale.client));
        this.trade = new Trade({}, this.sale);

        this.clientServer.getProducts().subscribe(
            (products: Array<Product>) => {
                this.products = products;
                this.ready = true;
            }
        );
    }

    ngDoCheck() {
        const changes = this.tradeDiffer.diff(this.trade);
        if (changes) {
            console.log(this.trade)
            this.store.dispatch(new UpdateFullTrade(this.trade));
        }
    }


    transferOneObject(forward: boolean) {
        if (forward && this.returnProductRow) {
            this.sale.addProduct(this.returnProductRow, 1);
            this.trade.removeReturnedProduct(this.returnProductRow.id);

            if (!this.trade.getProductOnList('returnedProducts', this.returnProductRow.id)) {
                this.returnProductRow = undefined;
            }
        } else if (!forward && this.keepProductRow) {
            this.trade.addReturnedProduct(new Product(this.keepProductRow));
            this.sale.removeProduct(this.keepProductRow.id, 1);

            if (!this.sale.getProductOnSaleList(this.keepProductRow.id)) {
                this.keepProductRow = undefined;
            }
        }
    }

    transferAllObjects(forward: boolean) {
        if (forward && this.returnProductRow) {
            while (this.returnProductRow) {
                this.transferOneObject(true);
            }
        } else if (!forward && this.keepProductRow) {
            while (this.keepProductRow) {
                this.transferOneObject(false);
            }
        }
    }

    onTypeaheadSelect(e: TypeaheadMatch) {
        this.typeaheadItem = new Product(e.item);
        this.typeaheadText += (' ' + e.item.size);
    }

    addPurchasedProduct() {
        if (this.typeaheadItem) {
            this.trade.addPurchasedProduct(this.typeaheadItem);
        }
    }

    removeProduct(id: number) {
        this.trade.removeAllPurchasedProducts(id);
    }

    endTrade() {
        if (!this.trade.returnedProducts.length) {
            this.dialog.open(PopupComponent, {
                height: '400px',
                width: '500px',
                data: {
                    'type': 'ok-face',
                    'title': 'Retorne algum produto!',
                    'text': 'Caso só precise vender produtos, faça uma venda.'
                }
            });
            return;
        }
        this.store.dispatch(new MovePage(true));
    }


}
