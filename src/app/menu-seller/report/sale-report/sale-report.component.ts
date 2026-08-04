import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {triggerPrintIfRequested} from '../../../utils';

@Component({
    selector: 'app-sale-report',
    templateUrl: './sale-report.component.html',
    styleUrls: ['./sale-report.component.scss']
})
export class SaleReportComponent implements OnInit {
    infos;

    constructor(private router: ActivatedRoute) {
    }

    ngOnInit() {
        this.infos = JSON.parse(this.router.snapshot.queryParams.infos);

        triggerPrintIfRequested(this.router.snapshot.queryParams);
    }

}
