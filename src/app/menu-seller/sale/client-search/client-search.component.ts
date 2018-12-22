import {Component, OnInit} from '@angular/core';
import {ClientService} from '../../../services/client.service';
import {Client} from '../../../models/client.model';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AddClient} from '../state/sale.actions';
import {AppState, State} from '../state/sale.reducers';

@Component({
    selector: 'app-client-search',
    templateUrl: './client-search.component.html',
    styleUrls: ['./client-search.component.scss']
})
export class ClientSearchComponent implements OnInit {
    isModalOpen = false;
    clients = [];
    client: Observable<State>;
    clientSelected = new Client({
        id: 0,
        name: 'Cliente (Não Identificado)'
    });
    selectedRow;

    constructor(private clientServer: ClientService, private store: Store<AppState>) {
    }

    ngOnInit() {
        this.client = this.store.select('sale');
    }

    searchClients(searchValue: string) {
        if (searchValue.length >= 3) {
            this.clientServer.getClients(searchValue).subscribe(
                (response) => {
                    this.clients = response;
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }

    selectClient(client: Client, index: number) {
        this.clientSelected = client;
        this.selectedRow = index;
    }

    addToSale() {
        this.store.dispatch(new AddClient(this.clientSelected));
        this.isModalOpen = false;
    }

    toggleModal(isOpen: boolean) {
        this.isModalOpen = isOpen;
    }

}
