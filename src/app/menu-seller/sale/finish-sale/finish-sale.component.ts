import {Component, OnInit} from '@angular/core';
import {ClientService} from '../../../services/client.service';
import {SaleCommunicationService} from '../../../services/sale-communication.service';
import {Sale} from '../../../models/sale.model';

@Component({
    selector: 'app-finish-sale',
    templateUrl: './finish-sale.component.html',
    styleUrls: ['./finish-sale.component.scss']
})
export class FinishSaleComponent implements OnInit {
    sale = new Sale({});

    constructor(private clientServer: ClientService,
                private saleCommunicationService: SaleCommunicationService) {
    }

    ngOnInit() {
        this.saleCommunicationService.saleSubject.subscribe(
            (sale) => {
                console.log(sale)
                this.sale = new Sale(sale);
            }
        );
    }

}
