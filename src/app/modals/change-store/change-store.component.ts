import {Component, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {Router} from '@angular/router';
declare const window: any;
const {ipcRenderer, remote} = window.require('electron');

@Component({
    selector: 'app-change-store',
    templateUrl: './change-store.component.html',
    styleUrls: ['./change-store.component.scss']
})
export class ChangeStoreComponent implements OnInit {
    stores = ['Verbo Divino', 'Aclimação', 'Itaim', 'Perdizes'];
    storeSelected;

    constructor(public dialogRef: MatDialogRef<any>, private router: Router,) {
    }

    ngOnInit() {
        this.storeSelected = remote.getGlobal('store');
    }

    close() {
        ipcRenderer.send('setStore', this.storeSelected);
        this.dialogRef.close();
    }


}
