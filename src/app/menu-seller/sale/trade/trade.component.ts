import {Component, OnInit} from '@angular/core';
import {Sale} from '../../../models/sale.model';
import {ActivatedRoute} from '@angular/router';
import {AddClient} from '../../../store/actions/sale.actions';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/state/app.state';
import {ClientService} from '../../../services/client.service';
import {Product} from '../../../models/product.model';
import {TypeaheadMatch} from 'ngx-bootstrap';
import {Trade} from '../../../models/trade.model';

@Component({
    selector: 'app-trade',
    templateUrl: './trade.component.html',
    styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements OnInit {
    ready: boolean = false;
    sale: Sale;
    keepProducts: Array<Product>;
    products: Array<Product> = [];
    typeaheadItem: Product;
    typeaheadText;
    trade: Trade;

    constructor(private router: ActivatedRoute, private store: Store<AppState>, private clientServer: ClientService) {
    }

    ngOnInit() {
        this.sale = new Sale(JSON.parse(this.router.snapshot.queryParams.sale));
        this.keepProducts = this.sale.products;
        console.log(this.keepProducts);
        this.store.dispatch(new AddClient(this.sale.client));
        this.trade = new Trade({}, this.sale);

        this.clientServer.getProducts().subscribe(
            (products: Array<Product>) => {
                this.products = products;
                this.ready = true;
            }
        );
    }

    onTypeaheadSelect(e: TypeaheadMatch) {
        this.typeaheadItem = new Product(e.item);
        this.typeaheadText += (' ' + e.item.size);
    }


}
