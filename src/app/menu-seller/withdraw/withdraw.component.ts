import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ClientService} from '../../services/client.service';
import {PopupComponent} from '../../modals/popup/popup.component';
import {Withdraw} from '../../models/withdraw.model';

const async = require('async');

@Component({
    selector: 'app-withdraw',
    templateUrl: './withdraw.component.html',
    styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent implements OnInit {
    currentScreen = 'Dinheiro';
    loading = false;
    withdraw = new Withdraw({quantity: 0});
    value: number;

    constructor(public dialogRef: MatDialogRef<WithdrawComponent>, private clientService: ClientService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        this.loading = true;
        this.clientService.getWithdrawInformation({name: this.currentScreen}).subscribe(
            (success) => {
                this.loading = false;
                this.withdraw = success;
            },
            (error) => {
                this.loading = false;
                this.dialog.open(PopupComponent, {
                    height: '400px',
                    width: '500px',
                    data: {
                        'type': 'sad',
                        'title': 'Erro',
                        'text': 'Não conseguimos acessar o banco de dados e obter as informações. Verifique a internet e depois tente novamente.'
                    }
                });
            }
        );
    }

    changeScreen(option: string) {
        this.loading = true;
        this.clientService.getWithdrawInformation({name: option}).subscribe(
            (success) => {
                this.loading = false;
                this.withdraw = success;
                this.currentScreen = option;
            },
            (error) => {
                this.loading = false;
                this.dialog.open(PopupComponent, {
                    height: '400px',
                    width: '500px',
                    data: {
                        'type': 'sad',
                        'title': 'Erro',
                        'text': 'Verifique a conexão.'
                    }
                });
            }
        );
    }

    updateWithdraw(isWithdraw: boolean) {
        const currentWithdraw = new Withdraw(this.withdraw);
        if (isWithdraw && this.value > this.withdraw.quantity) {
            this.dialog.open(PopupComponent, {
                height: '400px',
                width: '500px',
                data: {
                    'type': 'ok-face',
                    'title': 'Cuidado!',
                    'text': 'Não é possível retirar mais do que tem em caixa.'
                }
            });
            return;
        } else if (isWithdraw) {
            currentWithdraw.quantity -= this.value;
        } else {
            currentWithdraw.quantity += this.value;
        }

        this.loading = true;
        async.series({
                withdraw: (callback) => {
                    this.clientService.updateWithdraw(currentWithdraw).subscribe(
                        (next) => callback(null, next),
                        (error) => callback(error)
                    );
                },
                history: (callback) => {
                    this.clientService.createWithdrawHistory({
                        name: this.currentScreen,
                        withdraw: isWithdraw,
                        quantity: this.value
                    }).subscribe(
                        (next) => callback(null, next),
                        (error) => callback(error)
                    );
                }
            },
            (err, results) => {
                if (err) {
                    console.log(err);
                    this.dialog.open(PopupComponent, {
                        height: '400px',
                        width: '500px',
                        data: {
                            'type': 'sad',
                            'title': 'Erro',
                            'text': 'Verifique a conexão.'
                        }
                    });
                    this.loading = false;
                    return;
                }
                this.loading = false;
                this.withdraw = results.withdraw;
                this.value = undefined;
            });
    }

    lala() {
        console.log(this.value)

        console.log(typeof this.value)
    }

}
