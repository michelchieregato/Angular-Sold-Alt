import {WithdrawChoices} from '../constants/enums';
import {User} from './user.model';

export class WithdrawHistory {
    date: Date;
    store: string;
    withdraw: string;
    type: string;
    quantity: number;
    user: User;

    constructor(withdrawInfo: any) {
        this.date = new Date(withdrawInfo.date);
        this.quantity = parseFloat(withdrawInfo.quantity);
        this.store = withdrawInfo.store;
        this.type = withdrawInfo.name;
        this.user = new User(withdrawInfo.user);
        this.withdraw = WithdrawChoices[withdrawInfo.withdraw];
    }
}
