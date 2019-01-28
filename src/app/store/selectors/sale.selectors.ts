import {AppState} from '../state/app.state';
import {createSelector} from '@ngrx/store';
import {SaleState} from '../state/sale.state';

const selectSales = (state: AppState) => state.sale;

export const selectSale = createSelector(
    selectSales,
    (state: SaleState) => state.sale
);

export const selectProducts = createSelector(
    selectSales,
    (state: SaleState) => state.sale.products
);

export const selectClient = createSelector(
    selectSales,
    (state: SaleState) => state.sale.client
);

export const selectTotal = createSelector(
    selectSales,
    (state: SaleState) => {
        return state.sale.original_value || 0;
    }
);

export const selectDiscount = createSelector(
    selectSales,
    (state: SaleState) => state.sale.discount
);
