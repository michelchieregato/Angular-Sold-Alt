import {initialSaleState, SaleState} from './sale.state';
import {initialWithdrawState, WithdrawState} from './withdraw.state';
import {initialTradeState, TradeState} from './trade.state';

export interface AppState {
    sale: SaleState;
    withdraw: WithdrawState;
    trade: TradeState;
}

export const initialAppState: AppState = {
    sale: initialSaleState,
    withdraw: initialWithdrawState,
    trade: initialTradeState
};

export function getInitialState(): AppState {
    return initialAppState;
}
