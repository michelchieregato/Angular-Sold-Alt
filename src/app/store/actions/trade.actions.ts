import {Action} from '@ngrx/store';

export enum TradeEnumActions {
    UPDATE_FULL_TRADE = 'UPDATE_FULL_TRADE',
    UPDATE_TRADE_DISCOUNT = 'UPDATE_TRADE_DISCOUNT'
}

export class UpdateFullTrade implements Action {
    readonly type = TradeEnumActions.UPDATE_FULL_TRADE;

    constructor(public payload: any) {
    }
}

export class UpdateTradeDiscount implements Action {
    readonly type = TradeEnumActions.UPDATE_TRADE_DISCOUNT;

    constructor(public payload: number) {
    }
}

export type TradeActions = UpdateTradeDiscount | UpdateFullTrade;
