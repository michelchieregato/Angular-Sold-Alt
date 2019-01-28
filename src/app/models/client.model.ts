export class Client {
    id: number;
    cpf: string;
    name: string;
    email: string;
    tel: string;
    cep: string;

    constructor(clientInfo: any) {
        this.id = clientInfo.id;
        this.cpf = clientInfo.cpf;
        this.name = clientInfo.name;
        this.email = clientInfo.email;
        this.tel = clientInfo.tel;
        this.cep = clientInfo.cep;
    }
}
