import {Injectable} from '@angular/core';
import {Client} from '../models/client.model';
import {Sale} from '../models/sale.model';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class SaleCommunicationService {
    client: Client;
    sale: Sale;
    isModalOpen = new Subject();

    constructor() {
    }

    setClient(client: Client) {
        this.client = client;
    }

    getClient() {
        return this.client;
    }

    setSale(sale: Sale) {
        this.sale = sale;
    }

    getSale() {
        return this.sale;
    }

    toggleModal(bool: boolean) {
        this.isModalOpen.next(bool);
    }
}
