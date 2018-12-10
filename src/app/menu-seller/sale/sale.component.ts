import {Component, ElementRef, OnInit, ViewEncapsulation} from '@angular/core';
import {ClientService} from '../../services/client.service';
import {SaleCommunicationService} from '../../services/sale-communication.service';

@Component({
    selector: 'app-sale',
    templateUrl: './sale.component.html',
    styleUrls: ['./sale.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SaleComponent implements OnInit {

    constructor(private clientServer: ClientService,
                private saleCommunicationService: SaleCommunicationService, private elRef: ElementRef) {
        elRef.nativeElement.ownerDocument.body.style.overflow = 'hidden';
    }

    ngOnInit() {
        this.saleCommunicationService.element.subscribe(
            (element) => {
                const el = document.getElementById('second-page')
                el.scrollIntoView();
            }
        );
    }

}
