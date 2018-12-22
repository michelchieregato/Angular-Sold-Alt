import {Action} from '@ngrx/store';
import {Client} from '../../../models/client.model';
import {Sale} from '../../../models/sale.model';

export const ADD_CLIENT = 'ADD_CLIENT';
export const ADD_SALE = 'ADD_SALE';
export const MOVE_PAGE = 'MOVE_PAGE';

export class AddClient implements Action {
    readonly type = ADD_CLIENT;

    constructor(public payload: Client) {
    }
}

export class AddSale implements Action {
    readonly type = ADD_SALE;

    constructor(public payload: Sale) {
    }
}

export class MovePage implements Action {
    readonly type = MOVE_PAGE;

    constructor(public payload: boolean) {
    }
}

export type SaleActions = AddClient | AddSale | MovePage;
