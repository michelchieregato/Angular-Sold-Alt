import {SaleActions, SaleEnumActions} from '../actions/sale.actions';
import {initialSaleState} from '../state/sale.state';
import {Sale} from '../../models/sale.model';
import {Client} from '../../models/client.model';

export function saleReducer(state = initialSaleState, action: SaleActions) {
    switch (action.type) {
        case SaleEnumActions.ADD_CLIENT:
            state.sale.client = new Client(action.payload);
            return {
                ...state,
                sale: new Sale(state.sale)
            };
        case SaleEnumActions.MOVE_PAGE:
            return {
                ...state,
                pageDown: action.payload
            };
        case SaleEnumActions.UPDATE_DISCOUNT:
            state.sale = new Sale({...state.sale, discount: action.payload});
            return {
                ...state
            };
        case SaleEnumActions.UPDATE_FULL_SALE:
            return {
                ...state,
                sale: {
                    ...action.payload,
                    store: state.sale.store,
                    user: state.sale.user
                }
            };
        case SaleEnumActions.RESTART_PAGE:
            state = initialSaleState;
            state.sale.products = [];
            return {
                ...state
            };
        default:
            return state;
    }
}
