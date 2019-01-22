import { Component, OnInit } from '@angular/core';
import {Sale} from '../../../models/sale.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-product-report',
  templateUrl: './product-report.component.html',
  styleUrls: ['./product-report.component.scss']
})
export class ProductReportComponent implements OnInit {
    infos;

  constructor(private router: ActivatedRoute) { }

  ngOnInit() {

      this.infos = JSON.parse(this.router.snapshot.queryParams.infos);
      console.log(this.infos)
  }

}
