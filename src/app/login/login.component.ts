import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {ClientServer} from '../services/client.server';
import {MatDialog} from '@angular/material/dialog';
import {PopupComponent} from '../modals/popup/popup.component';


declare const window: any;

// Selector: normal -> app-login, seleciona vira tag. Com [] seleciona adicionando na div.
// Com . adiciona via classe

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    disabled = false;

    constructor(private router: Router, private clientServer: ClientServer, public dialog: MatDialog) {
    }

    ngOnInit() {
    }

    onSubmit(form: NgForm) {
        this.disabled = true;
        this.clientServer.login(form.value).subscribe(
            (response) => {
                switch (response) {
                    case 'Administrador':
                        this.router.navigate(['/seller', 'menu']);
                        break;
                    case 'Vendedor':
                        break;
                    default:
                        this.disabled = false;
                        this.router.navigate(['/seller', 'menu']);
                        this.dialog.open(PopupComponent, {
                            data: {
                                'type': 'sad',
                                'title': 'Acesso negado',
                                'text': 'Usuário ou senha incorretos'
                            }
                        });
                        break;

                }
            },
            (error) => {
                this.disabled = false;
                this.dialog.open(PopupComponent, {
                    data: {
                        'type': 'sad',
                        'title': 'Erro',
                        'text': 'Verifique a conexão'
                    }
                });
            }
        );

    }

}
