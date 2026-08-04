import {Component, OnInit} from '@angular/core';
import {StockType} from '../../constants/enums';
import {User} from '../../models/user.model';
import {SessionService} from '../../services/session.service';

@Component({
    selector: 'app-stock-manager',
    templateUrl: './stock-manager.component.html',
    styleUrls: ['./stock-manager.component.scss']
})
export class StockManagerComponent implements OnInit {
    stockType = StockType;
    tabIndex = 0;
    user: User;

    constructor(private session: SessionService) {
        this.user = this.session.getUser();
    }

    ngOnInit() {
    }

    changeTab(event){
        this.tabIndex = event.index;
    }

}
