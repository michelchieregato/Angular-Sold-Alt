import {Component, OnInit} from '@angular/core';
import {SaleCommunicationService} from '../../../services/sale-communication.service';
import {ClientService} from '../../../services/client.service';
import {Client} from '../../../models/client.model';

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
        name: 'Cliente'
    });
    selectedRow;

    constructor(private saleCommunicationService: SaleCommunicationService, private clientServer: ClientService) {
    }

    ngOnInit() {
        this.saleCommunicationService.isModalOpen.subscribe(
            (bool) => {
                console.log(bool)
                this.isModalOpen = bool;
            }
        );

    }

    toggleModal() {
        this.saleCommunicationService.toggleModal(false);
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
        this.client = client;
        this.selectedRow = index;
    }

}
