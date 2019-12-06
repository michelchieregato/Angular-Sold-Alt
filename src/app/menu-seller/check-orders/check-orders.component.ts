import {Component, OnInit} from '@angular/core';
import {ClientService} from '../../services/client.service';
import {Sale} from '../../models/sale.model';
import {SaleDetailComponent} from '../search-sale/sale-detail/sale-detail.component';
import {MatDialog} from '@angular/material/dialog';
import * as _ from 'lodash';
import {Router} from '@angular/router';
import {getProductsFromBackend} from '../../models/product.model';

declare const window: any;
const {ipcRenderer} = window.require('electron');

@Component({
    selector: 'app-check-orders',
    templateUrl: './check-orders.component.html',
    styleUrls: ['./check-orders.component.scss']
})
export class CheckOrdersComponent implements OnInit {
    loading = true;
    stores = ['Todas', 'Verbo Divino', 'Aclimação', 'Itaim', 'Perdizes'];
    storeSelected = 'Todas';
    displaySales = [];
    orderProducts = [];
    sales = [];

    constructor(private clientServer: ClientService, public dialog: MatDialog,
                private router: Router) {
    }

    ngOnInit() {
        this.loading = true;
        this.clientServer.getSales({
            store: this.storeSelected,
            full: true,
            order: true,
        }).subscribe(
            (next) => {
                this.sales = next;
                this.sales.map((sale) => sale.products = getProductsFromBackend(sale.products));
                this.displaySales = _.clone(this.sales);
                this.calculateProducts();
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            }
        );
    }

    openSaleDetailModal(sale: Sale) {
        const modal = this.dialog.open(SaleDetailComponent, {
            disableClose: false,
            maxHeight: '500px',
            width: '900px',
            data: {
                'transaction': sale
            }
        });

        modal.afterClosed().subscribe(saleId => {
            if (saleId) {
                this.displaySales = this.displaySales.filter(s => s.id !== saleId);
                this.sales = this.sales.filter(s => s.id !== saleId);
                this.calculateProducts();
            }
        });
    }

    changeStoreFilter() {
        if (this.storeSelected === 'Todas') {
            this.displaySales = this.sales;
            this.calculateProducts();
            return;
        }

        this.displaySales = this.sales.filter((sale) => {
            return sale.store === this.storeSelected;
        });
        this.calculateProducts();
    }

    calculateProducts() {
        this.orderProducts = [];
        this.displaySales.forEach((sale) => {
            sale.products.forEach((product) => {
                const hasInNewSale = _.some(_.map(this.orderProducts, 'product'), product);
                if (!hasInNewSale) {
                    this.orderProducts.push(_.clone(product));
                } else {
                    this.orderProducts.forEach((saleProduct) => {
                        if (_.isEqual(saleProduct, product)) {
                            saleProduct.quantity += product.quantity;
                        }
                    });
                }
            });
        });
    }

    generateOrderSaleReport() {
        const infos = {};
        const a = this.router.createUrlTree(['sale-report']);
        infos['sales'] = this.displaySales;
        infos['store'] = this.storeSelected;
        infos['order'] = true;
        a.queryParams = {
            infos: JSON.stringify(infos)
        };
        ipcRenderer.send('pdf', {'url': a.toString().substring(1)});
    }

    generateOrderReport() {
        const infos = {};
        const a = this.router.createUrlTree(['product-report']);
        infos['store'] = this.storeSelected;
        a.queryParams = {
            purchasedProducts: JSON.stringify(this.orderProducts),
            order: true,
            store: this.storeSelected
        };
        ipcRenderer.send('pdf', {'url': a.toString().substring(1)});
    }

}
