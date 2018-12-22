import {Sale} from '../../../models/sale.model';
import {Client} from '../../../models/client.model';
import * as SaleActions from './sale.actions';

export interface AppState {
    sale: State;
}

export interface State {
    sale: Sale;
    client: Client;
    pageDown: boolean;
}

const initialState = {
    sale: new Sale({}),
    client: new Client({
        id: 0,
        name: 'Cliente (Não Identificado)'
    }),
    pageDown: false
};

export function saleReducer(state = initialState, action: SaleActions.SaleActions) {
    switch (action.type) {
        case SaleActions.ADD_CLIENT:
            return {
                ...state,
                client: action.payload
            };
        case SaleActions.ADD_SALE:
            action.payload.client = state.client;
            return {
                ...state,
                sale: action.payload
            };
        case SaleActions.MOVE_PAGE:
            return {
                ...state,
                pageDown: action.payload
            };
        default:
            return state;
    }
}
