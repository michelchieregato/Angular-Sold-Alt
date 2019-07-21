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
import {Withdraw} from '../../../models/withdraw.model';
import {TypeOfSale} from '../../../constants/enums';
import {SaleCommunicationService} from '../../../services/sale-communication.service';
import {SalePayments} from '../../../models/payment.model';

import * as electron from 'electron';
import {Trade} from '../../../models/trade.model';
import {selectTrade} from '../../../store/selectors/trade.selectors';

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
    moneyWithdraw: Withdraw;
    checkbookWitdraw: Withdraw;
    sale: Sale;
    btnSelected = 'Dinheiro';
    addPayment: any = 0;
    sending = false;
    salePayment: SalePayments;
    withdrawUpdated = {money: 0, checkbook: 0};
    type: number;
    typesOfSale = TypeOfSale;

    // For trade
    trade: Trade;
    tradeObserver = this.store.pipe(select(selectTrade));

    constructor(private clientServer: ClientService, private store: Store<AppState>,
                private saleCommunicationService: SaleCommunicationService,
                public dialog: MatDialog, private router: Router) {
        switch (this.router.url.split('?')[0]) {
            case '/sale/order':
                this.type = TypeOfSale.ORDER;
                break;
            case '/sale/trade':
                this.type = TypeOfSale.TRADE;
                break;
            default:
                this.type = TypeOfSale.SALE;
                break;
        }
    }

    ngOnInit() {
        if (this.type !== TypeOfSale.TRADE) {
            this.saleObserver.subscribe(
                (sale) => {
                    this.sale = new Sale(sale);
                    this.salePayment = new SalePayments(this.sale);
                    this.addPayment = this.salePayment.cashToReceive;
                }
            );
        } else {
            this.tradeObserver.subscribe(
                (trade) => {
                    this.trade = new Trade(trade, trade.sale);
                    this.salePayment = new SalePayments(this.trade);
                    this.addPayment = this.salePayment.cashToReceive;
                    console.log(this.trade);
                }
            );
        }
    }

    openDiscountModal() {
        this.dialog.open(DiscountComponent, {
            disableClose: true,
            height: '200px',
            width: '700px',
            data: {
                type: this.type
            }
        });
        return;
    }

    selectButton(id: string) {
        this.btnSelected = id;
    }

    backPage() {
        this.store.dispatch(new MovePage(false));
    }

    removePayment(type: string) {
        this.salePayment.removePayment(type);
    }

    addToSale() {
        if (typeof (this.addPayment) === 'string') {
            this.addPayment = parseFloat(this.addPayment.replace(',', '.'));
        }

        if (!this.addPayment) {
            return;
        }

        this.salePayment.addPayment(this.btnSelected, this.addPayment);
        this.addPayment = null;
    }

    private restartSale() {
        this.btnSelected = 'Dinheiro';
        this.sale.value = 0;
        this.sale.original_value = 0;
        this.salePayment = new SalePayments(this.sale);
        this.store.dispatch(new RestartSale());
        this.withdrawUpdated = {money: 0, checkbook: 0};
    }

    private updateWithdraw() {
        this.withdrawUpdated.money = this.salePayment.getPaymentByType('Dinheiro') - this.salePayment.change;
        this.withdrawUpdated.checkbook = this.salePayment.getPaymentByType('Cheque');
    }

    private makeTaxCupom() {
        const a = this.router.createUrlTree(['tax-cupom']);
        a.queryParams = {
            sale: JSON.stringify(this.sale),
            payments: JSON.stringify(this.salePayment.payments),
            change: JSON.stringify(this.salePayment.change)
        };
        ipcRenderer.send('pdf', {'url': a.toString().substring(1)});
    }

    finalize() {
        if (this.salePayment.isFinished()) {
            this.dialog.open(PopupComponent, {
                height: '400px',
                width: '500px',
                data: {
                    'type': 'ok-face',
                    'title': 'Termine a venda!',
                    'text': 'A venda ainda não foi inteiramente paga. lembre de adicionar os pagamentos.'
                }
            });
            return;
        } else if (this.type === TypeOfSale.SALE) {
            this.finalizeSale();
        } else if (this.type === TypeOfSale.ORDER) {
            this.finalizeOrder();
        } else if (this.type === TypeOfSale.TRADE) {
            this.finalizeTrade();
        }
    }

    finalizeSale() {
        this.sending = true;
        async.auto({
            finishSale: (callback) => {
                this.clientServer.finishSale(this.sale.prepareToSendSale(this.salePayment.payments)).subscribe(
                    (success) => {
                        this.updateWithdraw();
                        callback(null, success);
                    },
                    (error) => callback(error));
            },
            updateWithdraw: ['finishSale', (results, callback) => {
                if (this.withdrawUpdated.money <= 0 && this.withdrawUpdated.checkbook <= 0) {
                    callback();
                } else {
                    this.clientServer.addWithdraw(this.withdrawUpdated).subscribe(
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
        }, (err) => {
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
                    this.clientServer.updateSaleFromOrder(oldSale.prepareToSendSale([])).subscribe(
                        (success) => callback(null, success),
                        (err) => callback(err)
                    );
                } else {
                    this.sale.finish_later = false;
                    this.clientServer.updateSaleFromOrder(this.sale.prepareToSendSale(this.salePayment.payments)).subscribe(
                        (success) => callback(null, success),
                        (err) => callback(err)
                    );
                }
            },
            updateNewSale: (callback) => {
                if (oldSale.products.length) {
                    this.sale.finish_later = false;
                    this.clientServer.finishSale(this.sale.prepareToSendSale(this.salePayment.payments)).subscribe(
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
            updateWithdraw: ['updateLocalWithdraw', (results, callback) => {
                if (this.withdrawUpdated.money <= 0 && this.withdrawUpdated.checkbook <= 0) {
                    callback();
                } else {
                    this.clientServer.addWithdraw(this.withdrawUpdated).subscribe(
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
        }, (err) => {
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

    finalizeTrade() {
        if (this.trade.original_value < 0 && (this.trade.sale.client.id !== 0 || this.trade.sale.client.id !== 1)) {
            let modal = this.dialog.open(PopupComponent, {
                height: '425px',
                width: '650px',
                data: {
                    'type': 'ok-face',
                    'title': 'A valor da devolução é maior que o dos novos produtos!',
                    'text': 'Você deseja deixar o valor extra de R$' +
                        (-1 * this.trade.original_value).toString() + ' como crédito associado ao cliente?',
                    'confirmation': true
                }
            });

            modal.afterClosed().subscribe(
                (confirmation) => {
                    if (typeof confirmation !== 'undefined') {
                        this.tradeProducts(confirmation);
                    }
                }
            );
        } else {
            this.tradeProducts(false);
        }
    }

    tradeProducts(updateClient) {
        this.sending = true;
        async.auto({
            finishTrade: (callback) => {
                console.log(this.clientServer)
                console.log(this.clientServer.finishTrade)
                console.log(this.clientServer.finishSale)
                this.clientServer.finishTrade(this.trade, this.salePayment, updateClient).subscribe(
                    (success) => {
                        console.log(success)
                        callback(null)
                    },
                    (error) => {
                        console.log(error)
                        callback(null)
                    }
                )
            },
            // updateLocalWithdraw: ['updateNewSale', 'updateOldSale', (results, callback) => {
            //     this.updateWithdraw();
            //     callback(null);
            // }],
            // updateWithdraw: ['updateLocalWithdraw', (results, callback) => {
            //     if (this.withdrawUpdated.money <= 0 && this.withdrawUpdated.checkbook <= 0) {
            //         callback();
            //     } else {
            //         this.clientServer.addWithdraw(this.withdrawUpdated).subscribe(
            //             (next) => callback(null, next),
            //             (error) => callback(error)
            //         );
            //
            //     }
            // }],
            // updateMoneyWithdrawHistory: ['updateLocalWithdraw', (results, callback) => {
            //     if (this.withdrawUpdated.money <= 0) {
            //         callback();
            //     } else {
            //         this.clientServer.createWithdrawHistory({
            //             name: 'Dinheiro',
            //             withdraw: 'S',
            //             quantity: this.withdrawUpdated.money
            //         }).subscribe(
            //             (next) => callback(null, next),
            //             (error) => callback(error)
            //         );
            //     }
            // }],
            // updateCheckbookWithdrawHistory: ['updateLocalWithdraw', (results, callback) => {
            //     if (this.withdrawUpdated.checkbook <= 0) {
            //         callback();
            //     } else {
            //         this.clientServer.createWithdrawHistory({
            //             name: 'Cheque',
            //             withdraw: 'S',
            //             quantity: this.withdrawUpdated.checkbook
            //         }).subscribe(
            //             (next) => callback(null, next),
            //             (error) => callback(error)
            //         );
            //     }
            // }]
        }, (err, results) => {
            this.sending = false;
            console.log(err, results)
        });}
}
