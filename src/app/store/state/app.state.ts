import {initialSaleState, SaleState} from './sale.state';

export interface AppState {
    sale: SaleState;
}

export const initialAppState: AppState = {
    sale: initialSaleState
};

export function getInitialState(): AppState {
    return initialAppState;
}
