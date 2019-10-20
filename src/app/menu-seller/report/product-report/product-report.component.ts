import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-product-report',
    templateUrl: './product-report.component.html',
    styleUrls: ['./product-report.component.scss']
})
export class ProductReportComponent implements OnInit {
    initialDate: string;
    finalDate: string;
    store: string;
    purchasedProducts: Array<ReportProduct>;
    returnedProducts: Array<ReportProduct>;

    constructor(private router: ActivatedRoute) {
    }

    ngOnInit() {
        this.initialDate = this.router.snapshot.queryParams.initialDate;
        this.finalDate = this.router.snapshot.queryParams.finalDate;
        this.store = this.router.snapshot.queryParams.store;
        this.purchasedProducts = JSON.parse(this.router.snapshot.queryParams.purchasedProducts);
        this.returnedProducts = JSON.parse(this.router.snapshot.queryParams.returnedProducts);
    }

}

interface ReportProduct {
    productId: number;
    name: string;
    size: string;
    quantity: number;
}
