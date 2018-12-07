import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
    title: string;
}

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss']
})

export class PopupComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<PopupComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    ngOnInit() {
        console.log(this.data);
    }

    closeModal(): void {
        this.dialogRef.close();
    }

}
