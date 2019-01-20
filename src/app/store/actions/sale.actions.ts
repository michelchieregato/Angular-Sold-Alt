import {Action} from '@ngrx/store';
import {Client} from '../../models/client.model';
import {Sale} from '../../models/sale.model';
import {Product} from '../../models/product.model';
import * as _ from 'lodash';

export enum SaleEnumActions {
    ADD_CLIENT = 'ADD_CLIENT',
    ADD_SALE = 'ADD_SALE',
    ADD_PRODUCT = 'ADD_PRODUCT',
    REMOVE_PRODUCT = 'REMOVE_PRODUCT',
    MOVE_PAGE = 'MOVE_PAGE',
    RESTART_PAGE = 'RESTART_PAGE',
    UPDATE_DISCOUNT = 'UPDATE_DISCOUNT',
    UPDATE_FULL_SALE = 'UPDATE_FULL_SALE'
}

export class AddClient implements Action {
    public readonly type = SaleEnumActions.ADD_CLIENT;

    constructor(public payload: Client) {
    }

}

export class AddSale implements Action {
    readonly type = SaleEnumActions.ADD_SALE;

    constructor(public payload: Sale) {
    }
}

export class MovePage implements Action {
    readonly type = SaleEnumActions.MOVE_PAGE;

    constructor(public payload: boolean) {
    }
}

export class AddProduct implements Action {
    readonly type = SaleEnumActions.ADD_PRODUCT;

    constructor(public payload: {}) {
    }
}

export class RemoveProduct implements Action {
    readonly type = SaleEnumActions.REMOVE_PRODUCT;

    constructor(public payload: number) {
    }
}

export class RestartSale implements Action {
    readonly type = SaleEnumActions.RESTART_PAGE;

    constructor() {
    }
}

export class UpdateDiscount implements Action {
    readonly type = SaleEnumActions.UPDATE_DISCOUNT;

    constructor(public payload: number) {
    }
}

export class UpdateFullSale implements Action {
    readonly type = SaleEnumActions.UPDATE_FULL_SALE;

    constructor(public payload: number) {
    }
}


export type SaleActions = AddClient | AddSale | MovePage | RestartSale | AddProduct | RemoveProduct | UpdateDiscount | UpdateFullSale;
