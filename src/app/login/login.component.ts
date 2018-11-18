import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

// Selector: normal -> app-login, seleciona vira tag. Com [] seleciona adicionando na div.
// Com . adiciona via classe

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.router.navigate(['/seller', 'menu']);
  }

}
