export enum TypeOfSale {
    SALE = 1,
    TRADE = 2,
    ORDER = 3
}

export enum WithdrawChoices {
    D = 'Deposito',
    S = 'Venda',
    W = 'Retirada',
    T = 'Troca'
}

export enum PaymentMethod {
    Money = 'Dinheiro',
    Checkbook = 'Cheque',
    Debit = 'Debito',
    Credit = 'Credito',
    Transfer = 'Transferencia'
}

export enum StockType {
    EDIT ,
    ADD,
    TRANSFER,
    VISUALIZE
}

export const SIZES = ['00', '02', '04', '06', '08', '10', '12', '14', 'PP', 'P', 'M', 'G', 'GG'];

// Tamanhos oferecidos na área administrativa (inclui ST, usado em alguns produtos)
export const ADMIN_SIZES = ['ST', ...SIZES];

// Prefixo que marca produto arquivado (mesma convenção do backend)
export const ARCHIVE_PREFIX = '*(A)';
