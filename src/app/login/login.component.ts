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
                switch (response['groups'][0]) {
                    case 'Administrador':
                        this.router.navigate(['/seller', 'menu']);
                        break;
                    case 'Vendedor':
                        this.router.navigate(['/seller', 'menu']);
                        break;
                    default:
                        this.router.navigate(['/seller', 'menu']);
                        break;
                }
            },
            (error) => {
                switch (error.status) {
                    case 401:
                        this.dialog.open(PopupComponent, {
                            data: {
                                'type': 'sad',
                                'title': 'Acesso negado',
                                'text': 'Usuário ou senha incorretos'
                            }
                        });
                        break;
                    default:
                        this.dialog.open(PopupComponent, {
                            data: {
                                'type': 'sad',
                                'title': 'Erro',
                                'text': 'Verifique a conexão'
                            }
                        });
                        break;
                }
                this.disabled = false;
            }
        );

    }

}
