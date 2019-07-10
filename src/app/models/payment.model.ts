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
    payments: Payment[] = [];

    constructor(sale) {
        this.sale = sale;
        this.sale.value = this.roundTo(sale.original_value * (1 - sale.discount / 100), 2);
        this.cashToReceive = (this.sale.value - this.cashReceived) > 0 ? (this.sale.value - this.cashReceived) : 0;
        this.cashToReceive = this.roundTo(this.cashToReceive, 2);
        this.change = (this.sale.value - this.cashReceived) < 0 ? -1 * (this.sale.value - this.cashReceived) : 0;
        this.change = this.roundTo(this.change, 2);
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
        this.change = (this.sale.value - this.cashReceived) < 0 ? -1 * (this.sale.value - this.cashReceived) : 0;
        this.cashToReceive = (this.sale.value - this.cashReceived) > 0 ? (this.sale.value - this.cashReceived) : 0;
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
