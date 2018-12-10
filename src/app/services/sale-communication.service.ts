import {Injectable} from '@angular/core';
import {Client} from '../models/client.model';
import {Sale} from '../models/sale.model';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class SaleCommunicationService {
    client: Client;
    sale = new Sale({});
    saleSubject = new Subject();
    element = new Subject();

    constructor() {
    }

    setClient(client: Client) {
        this.client = client;
    }

    getClient() {
        return this.client;
    }

    setSale(sale: Sale) {
        this.saleSubject.next(sale);
        this.sale = sale;
    }

    movePage(direction: boolean) {
        this.element.next(direction);
    }

}
