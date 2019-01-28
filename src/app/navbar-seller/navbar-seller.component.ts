import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {User} from '../models/user.model';
import {WithdrawComponent} from '../menu-seller/withdraw/withdraw.component';
import {MatDialog} from '@angular/material/dialog';
import {ChangeStoreComponent} from '../modals/change-store/change-store.component';

declare const window: any;
const {remote, global} = window.require('electron');

@Component({
    selector: 'app-navbar-seller',
    templateUrl: './navbar-seller.component.html',
    styleUrls: ['./navbar-seller.component.scss']
})
export class NavbarSellerComponent implements OnInit {
    title = 'Menu Principal';
    isMenu = true;
    open = false;
    store: string;
    user = new User(remote.getGlobal('user'));

    constructor(private router: Router, public dialog: MatDialog) {
        router.events.pipe(
            filter(e => {
                return e instanceof NavigationEnd;
            })
        ).subscribe((value) => {
            this.isMenu = false;
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
                    this.isMenu = true;
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

    openChangeStoreModal() {
        const dialogRef = this.dialog.open(ChangeStoreComponent, {
            maxHeight: '450px',
            width: '1000px'
        });

        dialogRef.afterClosed().subscribe(result => {
            this.title = 'Menu Principal - ' + remote.getGlobal('store');
        });
    }

}
