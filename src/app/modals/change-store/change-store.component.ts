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
    storeOptions = {
        [School.Pueri]: ['Verbo Divino', 'Aclimação', 'Itaim', 'Perdizes'],
        [School.Rio]: ['São Conrado', 'Recreio', 'Gente Miúda', 'Golfe Olímpio'],
    };
    storeSelected;
    schoolSelected;

    constructor(public dialogRef: MatDialogRef<any>) {
    }

    ngOnInit() {
        const school = remote.getGlobal('school');

        const isAdmin = remote.getGlobal('user').is_admin;

        if (isAdmin) {
            this.stores = [
                'Verbo Divino', 'Aclimação', 'Itaim', 'Perdizes',
                'São Conrado', 'Recreio', 'Gente Miúda', 'Golfe Olímpio',
            ];
        } else {
            this.stores = this.storeOptions[school];
        }
        this.storeSelected = remote.getGlobal('store');
    }

    close() {
        if (this.storeOptions[School.Pueri].includes(this.storeSelected)) {
            this.schoolSelected = School.Pueri;
        } else {
            this.schoolSelected = School.Rio;
        }

        ipcRenderer.send('setStore', this.storeSelected);
        ipcRenderer.send('setSchool', this.schoolSelected);
        console.log(this.schoolSelected);
        this.dialogRef.close();
    }


}
