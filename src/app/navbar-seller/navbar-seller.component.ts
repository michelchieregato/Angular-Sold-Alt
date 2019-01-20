import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'app-navbar-seller',
    templateUrl: './navbar-seller.component.html',
    styleUrls: ['./navbar-seller.component.scss']
})
export class NavbarSellerComponent implements OnInit {
    title = 'Menu Principal';
    open = false;

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
                default:
                    this.title = 'Menu Principal';
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
