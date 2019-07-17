import {ActionReducerMap} from '@ngrx/store';
import {saleReducer} from './sale.reducers';
import {withdrawReducer} from './withdraw.reducers';
import {tradeReducer} from './trade.reducers';

export const appReducers: ActionReducerMap<any> = {
    sale: saleReducer,
    withdraw: withdrawReducer,
    trade: tradeReducer
};

