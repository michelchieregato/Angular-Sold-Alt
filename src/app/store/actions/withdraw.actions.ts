import {Action} from '@ngrx/store';
import {Withdraw} from '../../models/withdraw.model';

export enum WithdrawEnumActions {
    UPDATE_MONEY_WITHDRAW = 'UPDATE_MONEY_WITHDRAW',
    UPDATE_CHECKBOOK_WITHDRAW = 'UPDATE_CHECKBOOK_WITHDRAW'
}

export class UpdateMoneyWithdraw implements Action {
    public readonly type = WithdrawEnumActions.UPDATE_MONEY_WITHDRAW;

    constructor(public payload: Withdraw) {
    }
}

export class UpdateCheckbookWithdraw implements Action {
    public readonly type = WithdrawEnumActions.UPDATE_CHECKBOOK_WITHDRAW;

    constructor(public payload: Withdraw) {
    }
}

export type WithdrawActions = UpdateMoneyWithdraw | UpdateCheckbookWithdraw;
