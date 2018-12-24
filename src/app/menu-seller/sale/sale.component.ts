import {Component, ElementRef, OnInit, ViewEncapsulation} from '@angular/core';
import {ClientService} from '../../services/client.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/state/app.state';

@Component({
    selector: 'app-sale',
    templateUrl: './sale.component.html',
    styleUrls: ['./sale.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SaleComponent implements OnInit {

    constructor(private clientServer: ClientService, private store: Store<AppState>, private elRef: ElementRef) {
        elRef.nativeElement.ownerDocument.body.style.overflow = 'hidden';
    }

    ngOnInit() {
        this.store.select('sale').subscribe(
            (element) => {
                if (element.pageDown) {
                    const el = document.getElementById('second-page');
                    el.scrollIntoView();
                } else {
                    const el = document.getElementById('first-page');
                    el.scrollIntoView();
                }
            }
        );
    }

}
