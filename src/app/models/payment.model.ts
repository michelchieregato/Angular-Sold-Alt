import {PaymentMethod, TypeOfSale} from '../constants/enums';
import {Sale} from './sale.model';
import {Trade} from './trade.model';

export function roundTo(n, digits) {
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

export function preparePaymentForBackend(payment: Payment) {
    return {
        paymentMethod: payment.type,
        value: payment.value
    };
}

export class Payment {
    type: PaymentMethod;
    value: number;

    constructor(data: any) {
        this.type = data.type;
        this.value = data.value;
    }
}

export class SalePayments {
    saleOrTrade: Sale | Trade;
    cashReceived: number = 0;
    cashToReceive: number = 0;
    change: number = 0;
    type: TypeOfSale;
    public payments: Payment[] = [];

    constructor(saleOrTrade, type = TypeOfSale.SALE) {
        this.saleOrTrade = saleOrTrade;
        this.saleOrTrade.value = this.saleOrTrade.calculateValue();
        this.cashToReceive = (this.saleOrTrade.value - this.cashReceived) > 0 ? (this.saleOrTrade.value - this.cashReceived) : 0;
        this.cashToReceive = roundTo(this.cashToReceive, 2);
        this.change = (this.saleOrTrade.value - this.cashReceived) < 0 ? -1 * (this.saleOrTrade.value - this.cashReceived) : 0;
        this.change = roundTo(this.change, 2);
        this.type = type;
    }

    private getCashReceivedValue() {
        if (this.payments.length) {
            this.cashReceived = this.payments.map(payment => {
                return (payment.value);
            }).reduce((a, b) => {
                return a + b;
            });
        } else {
            this.cashReceived = 0;
        }
        this.change = (this.saleOrTrade.value - this.cashReceived) < 0 ? -1 * (this.saleOrTrade.value - this.cashReceived) : 0;
        this.cashToReceive = (this.saleOrTrade.value - this.cashReceived) > 0 ? (this.saleOrTrade.value - this.cashReceived) : 0;
    }

    private getPaymentOnList(type) {
        return this.payments.filter(payment => {
            return payment.type === type;
        })[0];
    }

    public addPayment(type, payment) {
        if (this.getPaymentOnList(type)) {
            this.getPaymentOnList(type).value += payment;
        } else {
            this.payments.push({
                'type': type,
                'value': payment
            });
        }
        this.getCashReceivedValue();
    }

    public removePayment(type) {
        this.payments = this.payments.filter(payment => {
            return payment.type !== type;
        });
        this.getCashReceivedValue();
    }

    public getPaymentByType(type: string) {
        const payment = this.payments.filter(p => {
            return p.type === type;
        })[0];

        return payment ? payment.value : 0;
    }

    public isFinished() {
        return this.cashToReceive > 0;
    }
}
