import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
    title: string;
    type: any;
    text: string;
}

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss']
})

export class PopupComponent implements OnInit {
    confirmationModal: boolean;

    constructor(public dialogRef: MatDialogRef<PopupComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    ngOnInit() {
        this.confirmationModal = this.data['confirmation'];
    }

    closeModal(confirmation: boolean | undefined): void {
        this.dialogRef.close(confirmation);
    }

}
