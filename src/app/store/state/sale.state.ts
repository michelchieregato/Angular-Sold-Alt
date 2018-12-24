import {Sale} from '../../models/sale.model';
import {Client} from '../../models/client.model';
import {Product} from '../../models/product.model';
import {User} from '../../models/user.model';
declare const window: any;
const {remote} = window.require('electron');

export interface SaleState {
    sale: Sale;
    pageDown: boolean;
}

export const initialSaleState = {
    sale: new Sale({
        user: new User(remote.getGlobal('user')),
        client: new Client({
            id: 0,
            name: 'Cliente (Não Identificado)'
        }),
        store: remote.getGlobal('store'),
        value: 0,
        products: [],
        discount: 0
    }),
    pageDown: false
};
