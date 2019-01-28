import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

declare const window: any;
const {remote} = window.require('electron');

@Component({
    selector: 'app-navbar-seller',
    templateUrl: './navbar-seller.component.html',
    styleUrls: ['./navbar-seller.component.scss']
})
export class NavbarSellerComponent implements OnInit {
    title = 'Menu Principal';
    open = false;
    store: string;

    constructor(private router: Router) {
        router.events.pipe(
            filter(e => e instanceof NavigationEnd)
        ).subscribe((value) => {
            switch (value['url']) {
                case '/seller/report':
                    this.title = 'Relatórios';
                    break;
                case '/seller/search-sale':
                    this.title = 'Pesquisar Venda';
                    break;
                case '/seller/stock-transfer':
                    this.title = 'Transferência de estoque';
                    break;
                case '/seller/check-orders':
                    this.title = 'Estoque: Todas as unidades';
                    break;
                default:
                    this.title = 'Menu Principal - ' + remote.getGlobal('store');
                    break;
            }

        });
    }

    onDrawer(event: any) {
        if (!event.target.classList.contains('btn')) {
            this.open = !this.open;
        }
    }

    ngOnInit() {
    }

}
