import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../popup/popup.component';

@Component({
    selector: 'app-add-client',
    templateUrl: './add-client.component.html',
    styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {
    lala = 'oii';

    constructor(public dialogRef: MatDialogRef<AddClientComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    ngOnInit() {
    }

    closeModal(): void {
        this.dialogRef.close();
    }

    logCpf() {
        console.log(this.lala);
    }

}
