import {Component, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { School } from 'src/app/models/enum';
declare const window: any;
const {ipcRenderer, remote} = window.require('electron');


@Component({
    selector: 'app-change-store',
    templateUrl: './change-store.component.html',
    styleUrls: ['./change-store.component.scss']
})
export class ChangeStoreComponent implements OnInit {
    stores = [];
    storeSelected;
    schoolSelected;

    constructor(public dialogRef: MatDialogRef<any>) {
    }

    ngOnInit() {
        const storeOptions = {
            [School.Pueri]: ['Verbo Divino', 'Aclimação', 'Itaim', 'Perdizes'],
            [School.Rio]: ['São Conrado', 'Recreio', 'Gente Miúda', 'Golfe Olímpio'],
        };

        const school = remote.getGlobal('school');

        const isAdmin = remote.getGlobal('user').is_admin;

        if (isAdmin) {
            this.stores = [
                'Verbo Divino', 'Aclimação', 'Itaim', 'Perdizes',
                'São Conrado', 'Recreio', 'Gente Miúda', 'Golfe Olímpio',
            ];
        } else {
            this.stores = storeOptions[school];
        }
        this.storeSelected = remote.getGlobal('store');

        if (storeOptions[School.Pueri].includes(this.storeSelected)) {
            this.schoolSelected = School.Pueri;
        } else {
            this.schoolSelected = School.Rio;
        }
    }

    close() {
        ipcRenderer.send('setStore', this.storeSelected);
        ipcRenderer.send('setSchool', this.schoolSelected);
        this.dialogRef.close();
    }


}
