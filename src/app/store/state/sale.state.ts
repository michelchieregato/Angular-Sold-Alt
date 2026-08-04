import {Sale} from '../../models/sale.model';
import {Client} from '../../models/client.model';
import {User} from '../../models/user.model';
import {getSessionStore, getSessionUser} from '../../session-storage';

export interface SaleState {
    sale: Sale;
    pageDown: boolean;
}

export const initialSaleState = {
    sale: new Sale({
        user: new User(getSessionUser()),
        client: new Client({
            id: 0,
            name: 'Cliente (Não Identificado)'
        }),
        store: getSessionStore(),
        value: 0,
        original_value: 0,
        products: [],
        discount: 0
    }),
    pageDown: false
};
