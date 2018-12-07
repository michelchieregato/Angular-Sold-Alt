import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PopupComponent} from '../../modals/popup/popup.component';

declare const window: any;
const {ipcRenderer} = window.require('electron');

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    constructor(public dialog: MatDialog) {
    }

    ngOnInit() {
    }

    openSaleScreen() {
        ipcRenderer.send('open-sale-screen');
    }

}
