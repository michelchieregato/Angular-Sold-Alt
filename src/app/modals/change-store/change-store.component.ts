import {Component, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { School } from 'src/app/models/enum';
import {SessionService} from '../../services/session.service';


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

    constructor(public dialogRef: MatDialogRef<any>, private session: SessionService) {
    }

    ngOnInit() {
        const school = this.session.getSchool();

        const isAdmin = this.session.getUser().is_admin;

        if (isAdmin) {
            this.stores = [
                'Verbo Divino', 'Aclimação', 'Itaim', 'Perdizes',
                'São Conrado', 'Recreio', 'Gente Miúda', 'Golfe Olímpio',
            ];
        } else {
            this.stores = this.storeOptions[school];
        }
        this.storeSelected = this.session.getStore();
    }

    close() {
        if (this.storeOptions[School.Pueri].includes(this.storeSelected)) {
            this.schoolSelected = School.Pueri;
        } else {
            this.schoolSelected = School.Rio;
        }

        this.session.setStore(this.storeSelected);
        this.session.setSchool(this.schoolSelected);
        this.dialogRef.close();
    }


}
