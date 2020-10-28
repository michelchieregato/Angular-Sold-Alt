import {Component, OnInit} from '@angular/core';
import {StockType} from '../../constants/enums';
import {User} from '../../models/user.model';

declare const window: any;
const {remote} = window.require('electron');

@Component({
    selector: 'app-stock-manager',
    templateUrl: './stock-manager.component.html',
    styleUrls: ['./stock-manager.component.scss']
})
export class StockManagerComponent implements OnInit {
    stockType = StockType;
    tabIndex = 0;
    user = new User(remote.getGlobal('user'));

    constructor() {
    }

    ngOnInit() {
    }

    changeTab(event){
        this.tabIndex = event.index;
    }

}
