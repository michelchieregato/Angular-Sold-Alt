import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {WithdrawComponent} from '../withdraw/withdraw.component';
import {Router} from '@angular/router';

declare const window: any;
const {ipcRenderer} = window.require('electron');

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    constructor(public dialog: MatDialog, private router: Router) {
    }

    ngOnInit() {
    }

    openSaleScreen() {
        ipcRenderer.send('open-sale-screen');
    }

    openWithdrawModal() {
        this.dialog.open(WithdrawComponent, {
            maxHeight: '450px',
            width: '1000px'
        });
    }
}
