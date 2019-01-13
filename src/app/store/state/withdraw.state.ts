import {Sale} from '../../models/sale.model';
import {Client} from '../../models/client.model';
import {User} from '../../models/user.model';
import {Withdraw} from '../../models/withdraw.model';

declare const window: any;
const {remote} = window.require('electron');

export interface WithdrawState {
    MoneyWithdraw: Withdraw;
    CheckbookWithdraw: Withdraw;
}

export const initialWithdrawState = {
    MoneyWithdraw: new Withdraw({store: remote.getGlobal('user'), name: 'Dinheiro'}),
    CheckbookWithdraw: new Withdraw({store: remote.getGlobal('user'), name: 'Cheque'}),
};
