import {SaleActions, SaleEnumActions} from '../actions/sale.actions';
import {initialSaleState} from '../state/sale.state';
import {Sale} from '../../models/sale.model';
import {Client} from '../../models/client.model';


function getProductOnSaleList(state, id) {
    return state.sale.products.filter(saleProduct => {
        return saleProduct.id === id;
    });
}

function getSaleValue(state) {
    if (state.sale.products.length) {
        state.sale.original_value = state.sale.products.map(saleProduct => {
            return (saleProduct.quantity * saleProduct.price_sell);
        }).reduce((a, b) => {
            return a + b;
        });
    } else {
        state.sale.original_value = 0;
    }
}

function addProduct(state, product, qnt) {
    const getProduct = getProductOnSaleList(state, product.id);
    if (getProduct.length) {
        getProduct[0].quantity += qnt;
        state.sale.products = [...state.sale.products];
    } else {
        product.quantity = qnt;
        state.sale.products = [...state.sale.products, product];
    }
    getSaleValue(state);
}

function removeProduct(state, id: number) {
    state.sale.products = state.sale.products.filter(saleProduct => {
        return saleProduct.id !== id;
    });
    getSaleValue(state);
}

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
        case SaleEnumActions.ADD_PRODUCT:
            addProduct(state, action.payload['product'], action.payload['qnt']);
            state.sale = new Sale({...state.sale});
            return {
                ...state,
                sale: state.sale
            };
        case SaleEnumActions.REMOVE_PRODUCT:
            removeProduct(state, action.payload);
            state.sale = new Sale({...state.sale});
            return {
                ...state
            };
        case SaleEnumActions.UPDATE_DISCOUNT:
            state.sale = new Sale({...state.sale, discount: action.payload});
            return {
                ...state
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
