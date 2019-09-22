import {Client} from './client.model';
import {User} from './user.model';
import {Trade} from './trade.model';
import {Sale} from './sale.model';
import {PopupComponent} from '../modals/popup/popup.component';
import {MatDialog} from '@angular/material';

export abstract class Transaction {
    id: number;
    client: Client;
    user: User;
    store: any;
    datetime: Date;
    value: number = 0;
    original_value: number = 0;
    discount: number = 0;
    payments: any;
    clientDiscount = 0;

    constructor(info,  public dialog: MatDialog) {
        this.id = info.id;
        this.client = info.client;
        this.user = info.user;
        this.store = info.store;
        this.datetime = info.datetime ? new Date(info.datetime) : undefined;
        this.value = info.value ? parseFloat(info.value) : 0;
        this.original_value = info.original_value ? parseFloat(info.original_value) : 0;
        this.discount = info.discount ? parseFloat(info.discount) : 0;
        this.payments = info.payments;
    }

    hasClientDiscount() {
        return this.clientDiscount > 0;
    }

    getClientDiscount(transaction: Trade | Sale, callback: any) {
        let modal, discountToApply;
        if (transaction.original_value > 0 && transaction.client.id !== 0 && !transaction.hasClientDiscount()) {
            discountToApply = transaction.value > transaction.client.credit ? transaction.client.credit : transaction.value;
            modal = this.dialog.open(PopupComponent, {
                data: {
                    height: '425px',
                    width: '650px',
                    'type': 'ok-face',
                    'title': 'O cliente apresenta um crédito com a loja!',
                    'text': 'Você deseja aplicar o valor de R$' +
                        (discountToApply).toString() + ' como desconto, devido ao crédito do cliente?',
                    'confirmation': true
                }
            });

            modal.afterClosed().subscribe(
                (confirmation) => {
                    if (confirmation) {
                        transaction.value -= discountToApply;
                        transaction.client.credit -= discountToApply;
                        transaction.clientDiscount = discountToApply;
                        callback();
                    }
                }
            );
        } else {
            callback();
        }
    }
}
