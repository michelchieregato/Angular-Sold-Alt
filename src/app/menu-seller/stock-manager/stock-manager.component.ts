import {Component, OnInit} from '@angular/core';
import {StockType} from '../../constants/enums';

@Component({
    selector: 'app-stock-manager',
    templateUrl: './stock-manager.component.html',
    styleUrls: ['./stock-manager.component.scss']
})
export class StockManagerComponent implements OnInit {
    stockType = StockType;
    tabIndex = 0 ;

    constructor() {
    }

    ngOnInit() {
    }

    changeTab(event){
        this.tabIndex = event.index;
    }

}
