import {Client} from './client.model';
import {User} from './user.model';

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

    applyClientDiscount(discountToApply) {
        this.value -= discountToApply;
        this.client.credit -= discountToApply;
        this.clientDiscount = discountToApply;
    }
}

