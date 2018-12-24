import {Component, OnInit} from '@angular/core';
import {ClientService} from '../../../services/client.service';
import {Sale} from '../../../models/sale.model';
import {select, Store} from '@ngrx/store';
import {MovePage, RestartSale} from '../../../store/actions/sale.actions';
import {MatDialog} from '@angular/material/dialog';
import {PopupComponent} from '../../../modals/popup/popup.component';
import {AppState} from '../../../store/state/app.state';
import {selectSale} from '../../../store/selectors/sale.selectors';
import {DiscountComponent} from '../discount/discount.component';

@Component({
    selector: 'app-finish-sale',
    templateUrl: './finish-sale.component.html',
    styleUrls: ['./finish-sale.component.scss']
})
export class FinishSaleComponent implements OnInit {
    saleObserver = this.store.pipe(select(selectSale));
    sale: Sale;
    payments = [];
    btnSelected = 'Dinheiro';
    cashReceived = 0;
    cashToReceive = 0;
    change = 0;
    sending = false;

    constructor(private clientServer: ClientService, private store: Store<AppState>, public dialog: MatDialog) {
    }

    ngOnInit() {
        this.saleObserver.subscribe(
            (sale) => {
                this.sale = new Sale(sale);
                this.cashToReceive = (this.sale.value - this.cashReceived) > 0 ? (this.sale.value - this.cashReceived) : 0;
            }
        );
    }

    openDiscountModal() {
        this.dialog.open(DiscountComponent, {
            disableClose: true,
            height: '200px',
            width: '700px'
        });
        return;
    }

    selectButton(id: string) {
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

    removePayment(type: string) {
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

    private restartSale() {
        this.store.dispatch(new RestartSale());
    }

    finalizeSale() {
        if (this.cashToReceive > 0) {
            this.dialog.open(PopupComponent, {
                height: '400px',
                width: '500px',
                data: {
                    'type': 'ok-face',
                    'title': 'Termine a venda!',
                    'text': 'A venda ainda não foi inteiramente paga. lembre de adicionar os pagamentis.'
                }
            });
            return;
        }
        this.sending = true;
        this.clientServer.finishSale(this.sale.prepareToSendSale(this.payments)).subscribe(
            (success) => {
                this.restartSale();
                this.sending = false;
            },
            (error) => {
                console.log(error);
                this.dialog.open(PopupComponent, {
                    height: '400px',
                    width: '500px',
                    data: {
                        'type': 'sad',
                        'title': 'Não foi possível finalizar a venda!',
                        'text': 'Verifique a conexão.'
                    }
                });
                this.sending = false;
            }
        );
    }

}
