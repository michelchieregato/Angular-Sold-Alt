import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogData, PopupComponent} from '../popup/popup.component';
import {NgForm} from '@angular/forms';
import {ClientService} from '../../services/client.service';
import {Client} from '../../models/client.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/state/app.state';
import {AddClient} from '../../store/actions/sale.actions';

@Component({
    selector: 'app-add-client',
    templateUrl: './add-client.component.html',
    styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {
    disabled = false;

    constructor(public dialogRef: MatDialogRef<AddClientComponent>, private store: Store<AppState>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData, private clientServer: ClientService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }

        this.disabled = true;

        this.clientServer.saveClient(form.value).subscribe(
            (next) => {
                this.disabled = false;
                this.store.dispatch(new AddClient(new Client(next)));
                this.dialogRef.close();
            },
            (error) => {
                this.dialog.open(PopupComponent, {
                    height: '400px',
                    width: '500px',
                    data: {
                        'type': 'sad',
                        'title': 'Não foi possível adicionar o cliente.',
                        'text': 'Verifique a conexão ou se já existe um cliente com esse cpf.'
                    }
                });
                this.disabled = false;
            }
        );
    }

}
