import {initialWithdrawState} from '../state/withdraw.state';
import {WithdrawActions, WithdrawEnumActions} from '../actions/withdraw.actions';

export function withdrawReducer(state = initialWithdrawState, action: WithdrawActions) {
    switch (action.type) {
        case WithdrawEnumActions.UPDATE_CHECKBOOK_WITHDRAW:
            return {
                ...state,
                CheckbookWithdraw: action.payload
            };
        case WithdrawEnumActions.UPDATE_MONEY_WITHDRAW:
            return {
                ...state,
                MoneyWithdraw: action.payload
            };
        default:
            return state;
    }
}
