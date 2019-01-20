import {Injectable} from '@angular/core';
import {Sale} from '../models/sale.model';

@Injectable({providedIn: 'root'})
export class SaleCommunicationService {
    type: number;
    updatedSale: Sale;

    constructor() {
    }

    setType(type: number) {
        this.type = type;
    }

    getType() {
        return this.type;
    }

    setUpdatedSale(sale: Sale) {
        this.updatedSale = sale;
    }

    getUpdatedSale() {
        return this.updatedSale;
    }

}
