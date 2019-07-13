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
import {TypeOfSale} from '../../../constants/enums';
import {SaleCommunicationService} from '../../../services/sale-communication.service';
import {SalePayments} from '../../../models/payment.model';

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
    btnSelected = 'Dinheiro';
    addPayment: any = 0;
    sending = false;
    salePayment: SalePayments;
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
                console.log(sale)
                this.sale = new Sale(sale);
                this.salePayment = new SalePayments(this.sale);
                this.addPayment = this.salePayment.cashToReceive;
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
                this.clientServer.finishSale(this.sale.prepareToSendSale(this.salePayment.payments, false)).subscribe(
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
