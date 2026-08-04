import {Sale} from '../../models/sale.model';
import {Client} from '../../models/client.model';
import {User} from '../../models/user.model';
import {Withdraw} from '../../models/withdraw.model';
import {getSessionUser} from '../../session-storage';

export interface WithdrawState {
    MoneyWithdraw: Withdraw;
    CheckbookWithdraw: Withdraw;
}

export const initialWithdrawState = {
    // Nota: 'store' recebendo o user é comportamento preexistente (bug conhecido), mantido "as is"
    MoneyWithdraw: new Withdraw({store: getSessionUser(), name: 'Dinheiro'}),
    CheckbookWithdraw: new Withdraw({store: getSessionUser(), name: 'Cheque'}),
};
