import {Component, OnInit} from '@angular/core';
import {ClientService} from '../../../services/client.service';
import {Sale} from '../../../models/sale.model';
import {Store} from '@ngrx/store';
import {AppState} from '../state/sale.reducers';
import {MovePage} from '../state/sale.actions';

@Component({
    selector: 'app-finish-sale',
    templateUrl: './finish-sale.component.html',
    styleUrls: ['./finish-sale.component.scss']
})
export class FinishSaleComponent implements OnInit {
    sale = new Sale({});
    payments = [];
    btnSelected = 'Dinheiro';
    cashReceived = 0;
    cashToReceive = 0;
    change = 0;

    constructor(private clientServer: ClientService, private store: Store<AppState>) {
    }

    ngOnInit() {
        this.store.select('sale').subscribe(
            (sale) => {
                console.log(sale.sale.client)
                this.sale = new Sale(sale.sale);
                this.cashToReceive = (this.sale.value - this.cashReceived) > 0 ? (this.sale.value - this.cashReceived) : 0;
            }
        );
    }

    selectButton(id: String) {
        this.btnSelected = id;
    }

    backPage() {
        this.store.dispatch(new MovePage(false));
    }

    private getPaymentOnList(type) {
        return this.payments.filter(payment => {
            return payment.type === type;
        });
    }

    private getCashReceivedValue() {
        if (this.payments.length) {
            this.cashReceived =  this.payments.map(payment => {
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

    removePayment(type: String) {
        this.payments = this.payments.filter(payment => {
            return payment.type !== type;
        });
        this.getCashReceivedValue();
    }

    addToSale(a: any) {
        if (!a.value) {
            return;
        }

        if (this.getPaymentOnList(this.btnSelected).length) {
            this.getPaymentOnList(this.btnSelected)[0].value += parseFloat(a.value);
        } else {
            this.payments.push({
                'type': this.btnSelected,
                'value': parseFloat(a.value)
            });
        }
        this.getCashReceivedValue();
        a.value = null;
    }

    finalizeSale() {
        console.log(this.sale)
        // this.clientServer.finishSale()
    }

}
