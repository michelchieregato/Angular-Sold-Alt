import {initialSaleState, SaleState} from './sale.state';
import {initialWithdrawState, WithdrawState} from './withdraw.state';

export interface AppState {
    sale: SaleState;
    withdraw: WithdrawState;
}

export const initialAppState: AppState = {
    sale: initialSaleState,
    withdraw: initialWithdrawState
};

export function getInitialState(): AppState {
    return initialAppState;
}
