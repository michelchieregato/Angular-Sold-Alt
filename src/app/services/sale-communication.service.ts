import {Injectable} from '@angular/core';
import {Client} from '../models/client.model';
import {Sale} from '../models/sale.model';

@Injectable({providedIn: 'root'})
export class SaleCommunicationService {
    client: Client;
    sale: Sale;
    constructor() {}

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
}
