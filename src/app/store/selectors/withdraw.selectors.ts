import {AppState} from '../state/app.state';
import {createSelector} from '@ngrx/store';
import {WithdrawState} from '../state/withdraw.state';

const selectWithdrawState = (state: AppState) => state.withdraw;

export const selectWithdraw = createSelector(
    selectWithdrawState,
    (state: WithdrawState) => state
);
