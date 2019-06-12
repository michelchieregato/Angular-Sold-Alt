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
import {Router} from '@angular/router';
import {selectWithdraw} from '../../../store/selectors/withdraw.selectors';
import {Withdraw} from '../../../models/withdraw.model';
import {UpdateCheckbookWithdraw, UpdateMoneyWithdraw} from '../../../store/actions/withdraw.actions';
import {TypeOfSale} from '../../../constants/enums';
import {SaleCommunicationService} from '../../../services/sale-communication.service';

declare const window: any;
const {ipcRenderer, remote} = window.require('electron');
const async = require('async');

@Component({
    selector: 'app-finish-sale',
    templateUrl: './finish-sale.component.html',
    styleUrls: ['./finish-sale.component.scss']
})
export class FinishSaleComponent implements OnInit {
    saleObserver = this.store.pipe(select(selectSale));
    withdrawObserver = this.store.pipe(select(selectWithdraw));
    moneyWithdraw: Withdraw;
    checkbookWitdraw: Withdraw;
    sale: Sale;
    payments = [];
    btnSelected = 'Dinheiro';
    cashReceived = 0;
    cashToReceive = 0;
    change = 0;
    addPayment: any = 0;
    sending = false;
    withdrawUpdated = {money: 0, checkbook: 0};
    type: number;

    constructor(private clientServer: ClientService, private store: Store<AppState>,
                private saleCommunicationService: SaleCommunicationService,
                public dialog: MatDialog, private router: Router) {
        switch (this.router.url.split('?')[0]) {
            case '/sale/order':
                this.type = TypeOfSale.ORDER;
                break;
            default:
                this.type = TypeOfSale.SALE;
                break;
        }
    }

    ngOnInit() {
        this.saleObserver.subscribe(
            (sale) => {
                this.sale = new Sale(sale);
                console.log(sale);
                this.cashToReceive = (this.sale.value - this.cashReceived) > 0 ? (this.sale.value - this.cashReceived) : 0;
                this.cashToReceive = this.roundTo(this.cashToReceive, 2);
                this.change = (this.sale.value - this.cashReceived) < 0 ? -1 * (this.sale.value - this.cashReceived) : 0;
                this.change = this.roundTo(this.change, 2);
                this.addPayment = this.cashToReceive;
            }
        );

        this.withdrawObserver.subscribe(
            (withdraws) => {
                this.moneyWithdraw = withdraws.MoneyWithdraw;
                this.checkbookWitdraw = withdraws.CheckbookWithdraw;
            }
        );
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

    addToSale() {
        if (typeof (this.addPayment) === 'string') {
            this.addPayment = parseFloat(this.addPayment.replace(',', '.'));
        }
        if (!this.addPayment) {
            return;
        }

        if (this.getPaymentOnList(this.btnSelected).length) {
            this.getPaymentOnList(this.btnSelected)[0].value += this.addPayment;
        } else {
            this.payments.push({
                'type': this.btnSelected,
                'value': this.addPayment
            });
        }
        this.getCashReceivedValue();
        this.addPayment = null;
    }

    private restartSale() {
        this.cashReceived = 0;
        this.cashToReceive = 0;
        this.change = 0;
        this.payments = [];
        this.btnSelected = 'Dinheiro';
        this.sale.value = 0;
        this.sale.original_value = 0;
        this.store.dispatch(new RestartSale());
        this.withdrawUpdated = {money: 0, checkbook: 0};

    }

    private updateWithdraw() {
        this.payments.forEach((payment) => {
            if (payment.type === 'Dinheiro') {
                this.moneyWithdraw.quantity += payment.value - this.change;
                this.withdrawUpdated.money = payment.value - this.change;
                this.store.dispatch(new UpdateMoneyWithdraw(this.moneyWithdraw));
            } else if (payment.type === 'Cheque') {
                this.checkbookWitdraw.quantity += payment.value;
                this.withdrawUpdated.checkbook = payment.value;
                this.store.dispatch(new UpdateCheckbookWithdraw(this.checkbookWitdraw));
            }
        });
    }

    private makeTaxCupom() {
        const a = this.router.createUrlTree(['tax-cupom']);
        a.queryParams = {
            sale: JSON.stringify(this.sale),
            payments: JSON.stringify(this.payments),
            change: JSON.stringify(this.change)
        };
        console.log(a);
        ipcRenderer.send('pdf', {'url': a.toString().substring(1)});
    }

    finalize() {
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
        } else if (this.type === TypeOfSale.SALE) {
            this.finalizeSale();
        } else if (this.type === TypeOfSale.ORDER) {
            this.finalizeOrder();
        }
    }

    finalizeSale() {
        this.sending = true;
        async.auto({
            finishSale: (callback) => {
                this.clientServer.finishSale(this.sale.prepareToSendSale(this.payments, false)).subscribe(
                    (success) => {
                        this.updateWithdraw();
                        callback(null, success);
                    },
                    (error) => callback(error));
            },
            updateMoneyWithdraw: ['finishSale', (results, callback) => {
                if (this.withdrawUpdated.money <= 0) {
                    callback();
                } else {
                    this.clientServer.updateWithdraw(this.moneyWithdraw).subscribe(
                        (next) => callback(null, next),
                        (error) => callback(error)
                    );
                }
            }],
            updateCheckbookWithdraw: ['finishSale', (results, callback) => {
                if (this.withdrawUpdated.checkbook <= 0) {
                    callback();
                } else {
                    this.clientServer.updateWithdraw(this.checkbookWitdraw).subscribe(
                        (next) => callback(null, next),
                        (error) => callback(error)
                    );
                }
            }],
            updateMoneyWithdrawHistory: ['finishSale', (results, callback) => {
                if (this.withdrawUpdated.money <= 0) {
                    callback();
                } else {
                    this.clientServer.createWithdrawHistory({
                        name: 'Dinheiro',
                        withdraw: 'S',
                        quantity: this.withdrawUpdated.money
                    }).subscribe(
                        (next) => callback(null, next),
                        (error) => callback(error)
                    );
                }
            }],
            updateCheckbookWithdrawHistory: ['finishSale', (results, callback) => {
                if (this.withdrawUpdated.checkbook <= 0) {
                    callback();
                } else {
                    this.clientServer.createWithdrawHistory({
                        name: 'Cheque',
                        withdraw: 'S',
                        quantity: this.withdrawUpdated.checkbook
                    }).subscribe(
                        (next) => callback(null, next),
                        (error) => callback(error)
                    );
                }
            }]
        }, (err, results) => {
            if (err) {
                console.log(err);
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
                return;
            }
            this.makeTaxCupom();
            this.restartSale();
            this.sending = false;
        });
    }

    finalizeOrder() {
        const oldSale = this.saleCommunicationService.getUpdatedSale();
        this.sending = true;
        async.auto({
            updateOldSale: (callback) => {
                if (oldSale.products.length) {
                    oldSale.finish_later = true;
                    this.clientServer.updateSaleFromOrder(oldSale.prepareToSendSale([], true)).subscribe(
                        (success) => callback(null, success),
                        (err) => callback(err)
                    );
                } else {
                    this.sale.finish_later = false;
                    this.clientServer.updateSaleFromOrder(this.sale.prepareToSendSale(this.payments, true)).subscribe(
                        (success) => callback(null, success),
                        (err) => callback(err)
                    );
                }
            },
            updateNewSale: (callback) => {
                if (oldSale.products.length) {
                    this.sale.finish_later = false;
                    this.clientServer.finishSale(this.sale.prepareToSendSale(this.payments, true)).subscribe(
                        (success) => {
                            callback(null, success);
                        },
                        (error) => callback(error));
                } else {
                    callback(null);
                }
            },
            updateLocalWithdraw: ['updateNewSale', 'updateOldSale', (results, callback) => {
                this.updateWithdraw();
                callback(null);
            }],
            updateMoneyWithdraw: ['updateLocalWithdraw', (results, callback) => {
                if (this.withdrawUpdated.money <= 0) {
                    callback();
                } else {
                    this.clientServer.updateWithdraw(this.moneyWithdraw).subscribe(
                        (next) => callback(null, next),
                        (error) => callback(error)
                    );
                }
            }],
            updateCheckbookWithdraw: ['updateLocalWithdraw', (results, callback) => {
                if (this.withdrawUpdated.checkbook <= 0) {
                    callback();
                } else {
                    this.clientServer.updateWithdraw(this.checkbookWitdraw).subscribe(
                        (next) => callback(null, next),
                        (error) => callback(error)
                    );
                }
            }],
            updateMoneyWithdrawHistory: ['updateLocalWithdraw', (results, callback) => {
                if (this.withdrawUpdated.money <= 0) {
                    callback();
                } else {
                    this.clientServer.createWithdrawHistory({
                        name: 'Dinheiro',
                        withdraw: 'S',
                        quantity: this.withdrawUpdated.money
                    }).subscribe(
                        (next) => callback(null, next),
                        (error) => callback(error)
                    );
                }
            }],
            updateCheckbookWithdrawHistory: ['updateLocalWithdraw', (results, callback) => {
                if (this.withdrawUpdated.checkbook <= 0) {
                    callback();
                } else {
                    this.clientServer.createWithdrawHistory({
                        name: 'Cheque',
                        withdraw: 'S',
                        quantity: this.withdrawUpdated.checkbook
                    }).subscribe(
                        (next) => callback(null, next),
                        (error) => callback(error)
                    );
                }
            }]
        }, (err, results) => {
            if (err) {
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
                return;
            }
            this.makeTaxCupom();
            this.restartSale();
            this.sending = false;
            const win = remote.getCurrentWindow();
            win.close();
        });
    }
}
