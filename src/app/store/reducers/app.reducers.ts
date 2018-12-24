import {AppState} from '../state/app.state';
import {ActionReducerMap} from '@ngrx/store';
import {saleReducer} from './sale.reducers';

export const appReducers: ActionReducerMap<AppState, any> = {
    sale: saleReducer
};
