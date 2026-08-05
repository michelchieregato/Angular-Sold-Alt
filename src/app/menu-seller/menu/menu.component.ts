import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {WithdrawComponent} from '../withdraw/withdraw.component';
import {Router} from '@angular/router';
import {openTab} from '../../utils';
import {SessionService} from '../../services/session.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
    isAdmin = false;

    constructor(public dialog: MatDialog, private router: Router,
                private session: SessionService) {
        this.isAdmin = this.session.getUser().is_admin;
    }

    ngOnInit() {
    }

    openSaleScreen() {
        openTab('/sale/new-sale');
    }

    openWithdrawModal() {
        this.dialog.open(WithdrawComponent, {
            maxHeight: '450px',
            width: '1000px'
        });
    }
}
