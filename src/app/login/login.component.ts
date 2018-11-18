import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {ClientServer} from '../services/client.server';

declare const window: any;

// Selector: normal -> app-login, seleciona vira tag. Com [] seleciona adicionando na div.
// Com . adiciona via classe

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(private router: Router, private clientServer: ClientServer) {
    }

    ngOnInit() {
    }

    onSubmit(form: NgForm) {
        this.clientServer.login(form.value).subscribe(
            (response) => {
                console.log(response);
                // this.router.navigate(['/seller', 'menu']);
            },
            (error) => console.log(error)
        );

    }

}
