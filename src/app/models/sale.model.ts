import {User} from './user.model';

export class Sale {
    client: number;
    user: User;
    store: number;
    datetime: number;
    value: number;
    finish_later: boolean;

    constructor(saleInfo: any) {
        this.client = saleInfo.client;
        this.user = saleInfo.user;
        this.store = saleInfo.store;
        this.datetime = saleInfo.datetime;
        this.value = saleInfo.value;
        this.finish_later = saleInfo.finish_later;
    }

}
