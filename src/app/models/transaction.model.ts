import {Client} from './client.model';
import {User} from './user.model';
import {roundTo} from './payment.model';

export abstract class Transaction {
    id: number;
    client: Client;
    user: User;
    store: any;
    datetime: Date;
    value: number = 0;
    original_value: number = 0;
    discount: number = 0;
    payments: any;
    clientDiscount = 0;

    protected constructor(info) {
        this.id = info.id;
        this.client = info.client;
        this.user = info.user;
        this.store = info.store;
        this.datetime = info.datetime ? new Date(info.datetime) : undefined;
        this.value = info.value ? parseFloat(info.value) : 0;
        this.original_value = info.original_value ? parseFloat(info.original_value) : 0;
        this.discount = info.discount ? parseFloat(info.discount) : 0;
        this.payments = info.payments;
        this.clientDiscount = info.clientDiscount ? info.clientDiscount : 0;
    }

    hasClientDiscount() {
        return this.clientDiscount > 0;
    }

    getClientDiscount() {
        if (this.original_value > 0 && this.client.id !== 0 && !this.hasClientDiscount()) {
            return this.value > this.client.credit ? this.client.credit : this.value;
        } else {
            return 0;
        }
    }

    public calculateValue() {
        return roundTo(roundTo(this.original_value * (1 - this.discount / 100), 2) - this.clientDiscount, 2);
    }
}

