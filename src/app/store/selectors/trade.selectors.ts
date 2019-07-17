import {AppState} from '../state/app.state';
import {createSelector} from '@ngrx/store';
import {TradeState} from '../state/trade.state';

const selectTradeState = (state: AppState) => state.trade;

export const selectTrade = createSelector(
    selectTradeState,
    (state: TradeState) => state.trade
);
