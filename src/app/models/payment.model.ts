import {PaymentMethod} from '../constants/enums';
import {Sale} from './sale.model';

export class Payment {
    type: PaymentMethod;
    value: number;

    constructor(data: any) {
        this.type = data.type;
        this.value = data.value;
    }
}

export class SalePayments {
    sale: Sale;
    cashReceived: number = 0;
    cashToReceive: number = 0;
    change: number = 0;
    payments: Array<Payment> = [];

    constructor(sale) {
        this.sale = sale;
        this.sale.value = this.roundTo(sale.original_value * (1 - sale.discount / 100), 2);
    }

    private roundTo(n, digits) {
        let negative = false;
        if (digits === undefined) {
            digits = 0;
        }
        if (n < 0) {
            negative = true;
            n = n * -1;
        }
        const multiplicator = Math.pow(10, digits);
        n = parseFloat((n * multiplicator).toFixed(11));
        n = (Math.round(n) / multiplicator).toFixed(2);
        if (negative) {
            n = (n * -1).toFixed(2);
        }
        return parseFloat(n);
    }


}
