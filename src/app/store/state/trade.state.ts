import {Trade} from '../../models/trade.model';

export interface TradeState {
    trade: Trade;
}

export const initialTradeState = {
    trade: new Trade({}, null)
};
