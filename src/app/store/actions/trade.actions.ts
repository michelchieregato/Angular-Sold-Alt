import {Action} from '@ngrx/store';

export enum TradeEnumActions {
    UPDATE_FULL_TRADE = 'UPDATE_FULL_TRADE',
    UPDATE_DISCOUNT = 'UPDATE_DISCOUNT'
}

export class UpdateFullTrade implements Action {
    readonly type = TradeEnumActions.UPDATE_FULL_TRADE;

    constructor(public payload: any) {
    }
}

export class UpdateDiscount implements Action {
    readonly type = TradeEnumActions.UPDATE_DISCOUNT;

    constructor(public payload: number) {
    }
}

export type TradeActions = UpdateDiscount | UpdateFullTrade;
