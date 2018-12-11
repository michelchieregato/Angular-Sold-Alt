import {Component, OnInit} from '@angular/core';
import {SaleCommunicationService} from '../../../services/sale-communication.service';
import {ClientService} from '../../../services/client.service';
import {Client} from '../../../models/client.model';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-client-search',
    templateUrl: './client-search.component.html',
    styleUrls: ['./client-search.component.scss']
})
export class ClientSearchComponent implements OnInit {
    isModalOpen = false;
    clients = [];
    client = new Client({
        id: 0,
        name: 'Cliente (Não Identificado)'
    });
    clientSelected = new Client({
        id: 0,
        name: 'Cliente (Não Identificado)'
    });
    selectedRow;

    constructor(private saleCommunicationService: SaleCommunicationService, private clientServer: ClientService) {
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
        this.client = this.clientSelected;
        this.saleCommunicationService.setClient(this.clientSelected);
        this.isModalOpen = false;
    }

    toggleModal(isOpen: boolean) {
        this.isModalOpen = isOpen;
    }

}
