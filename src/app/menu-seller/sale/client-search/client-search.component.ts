import {Component, OnInit} from '@angular/core';
import {ClientService} from '../../../services/client.service';
import {Client} from '../../../models/client.model';
import {select, Store} from '@ngrx/store';
import {AddClient} from '../../../store/actions/sale.actions';
import {AppState} from '../../../store/state/app.state';
import {selectClient} from '../../../store/selectors/sale.selectors';

@Component({
    selector: 'app-client-search',
    templateUrl: './client-search.component.html',
    styleUrls: ['./client-search.component.scss']
})
export class ClientSearchComponent implements OnInit {
    isModalOpen = false;
    clients = [];
    client = this.store.pipe(select(selectClient));
    clientSelected = new Client({
        id: 0,
        name: 'Cliente (Não Identificado)'
    });
    selectedRow;

    constructor(private clientServer: ClientService, private store: Store<AppState>) {
    }

    ngOnInit() {
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
