import {initialTradeState} from '../state/trade.state';
import {TradeActions, TradeEnumActions} from '../actions/trade.actions';
import {Trade} from '../../models/trade.model';

export function tradeReducer(state = initialTradeState, action: TradeActions) {

    switch (action.type) {
        case TradeEnumActions.UPDATE_FULL_TRADE:
            return {
                ...state,
                trade: new Trade({
                    ...action.payload
                }, action.payload.sale)
            };
        case TradeEnumActions.UPDATE_TRADE_DISCOUNT:
            state.trade.sale.discount = action.payload;
            return {
                ...state,
                trade: new Trade({
                    ...state.trade,
                }, state.trade.sale)
            };
        default:
            return state;
    }

}
