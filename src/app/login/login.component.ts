import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {ClientService} from '../services/client.service';
import {MatDialog} from '@angular/material/dialog';
import {PopupComponent} from '../modals/popup/popup.component';
import {User} from '../models/user.model';


declare const window: any;
const { ipcRenderer } = window.require('electron');

// Selector: normal -> app-login, seleciona vira tag. Com [] seleciona adicionando na div.
// Com . adiciona via classe

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    disabled = false;

    constructor(private router: Router, private clientServer: ClientService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
    }

    onSubmit(form: NgForm) {
        this.disabled = true;
        this.clientServer.login(form.value).subscribe(
            (response) => {
                ipcRenderer.send('setUser', new User(response));
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
                            height: '400px',
                            width: '500px',
                            data: {
                                'type': 'sad',
                                'title': 'Acesso negado',
                                'text': 'Usuário ou senha incorretos'
                            }
                        });
                        break;
                    default:
                        this.dialog.open(PopupComponent, {
                            height: '400px',
                            width: '500px',
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
