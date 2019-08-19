import {initialTradeState} from '../state/trade.state';
import {TradeActions, TradeEnumActions} from '../actions/trade.actions';
import {Trade} from '../../models/trade.model';
import {roundTo} from '../../models/payment.model';

export function tradeReducer(state = initialTradeState, action: TradeActions) {

    switch (action.type) {
        case TradeEnumActions.UPDATE_FULL_TRADE:
            return {
                ...state,
                trade: new Trade({
                    ...action.payload
                }, action.payload.saleID)
            };
        case TradeEnumActions.UPDATE_TRADE_DISCOUNT:
            state.trade.discount = action.payload;
            state.trade.value = roundTo(state.trade.original_value * (1 - state.trade.discount / 100), 2);
            return {
                ...state,
                trade: new Trade({
                    ...state.trade,
                }, state.trade.saleID)
            };
        default:
            return state;
    }

}
