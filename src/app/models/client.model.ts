export class Client {
    cpf: number;
    name: string;
    email: string;
    tel: string;
    cep: string;

    constructor(clientInfo: any) {
        this.cpf = clientInfo.id;
        this.name = clientInfo.first_name;
        this.email = clientInfo.last_name;
        this.tel = clientInfo.tel;
        this.cep = clientInfo.cep;
    }
}
