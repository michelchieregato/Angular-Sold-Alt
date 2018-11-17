import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar-seller',
  templateUrl: './navbar-seller.component.html',
  styleUrls: ['./navbar-seller.component.scss']
})
export class NavbarSellerComponent implements OnInit {

  open = false;

  constructor() { }

  onDrawer(event: any) {
    if (!event.target.classList.contains('btn')) {
      this.open = !this.open;
    }
  }

  ngOnInit() {
  }

}
