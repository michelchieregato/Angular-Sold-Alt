import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {School} from '../../../models/enum';

@Component({
    selector: 'app-new-product',
    templateUrl: './new-product.component.html',
    styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {
    name = '';
    schoolLabel: string;
    existingNames: string[] = [];

    constructor(public dialogRef: MatDialogRef<NewProductComponent>,
                @Inject(MAT_DIALOG_DATA) public data: { school: School, existingNames: string[] }) {
    }

    ngOnInit() {
        this.schoolLabel = this.data.school === School.Rio ? 'Rio de Janeiro' : 'Pueri Domus';
        this.existingNames = (this.data.existingNames || []).map((name) => name.toLowerCase());
    }

    get cleanName(): string {
        return this.name.trim().toUpperCase();
    }

    get duplicated(): boolean {
        return !!this.cleanName && this.existingNames.includes(this.cleanName.toLowerCase());
    }

    get similarNames(): string[] {
        const query = this.cleanName.toLowerCase();
        if (query.length < 3) {
            return [];
        }
        return (this.data.existingNames || [])
            .filter((name) => name.toLowerCase().includes(query) && name.toLowerCase() !== query)
            .slice(0, 5);
    }

    confirm() {
        if (!this.cleanName || this.duplicated) {
            return;
        }
        this.dialogRef.close(this.cleanName);
    }
}
