export class Withdraw {
    id: number;
    store: number;
    name: string;
    quantity: number;

    constructor(withdrawInfo: any) {
        this.id = withdrawInfo.id;
        this.quantity = withdrawInfo.quantity;
        this.store = withdrawInfo.store;
        this.name = withdrawInfo.name;
    }
}
