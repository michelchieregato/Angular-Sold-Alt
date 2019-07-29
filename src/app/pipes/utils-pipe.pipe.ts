import {Pipe, PipeTransform} from '@angular/core';
import {User} from '../models/user.model';
import {TypeOfSale} from '../constants/enums';

@Pipe({
    name: 'paymentPipe'
})
export class PaymentPipe implements PipeTransform {

    transform(value: Array<any>, args?: any): any {
        if (!value.length) {
            return '?';
        } else if (value.length === 1) {
            return value[0].paymentMethod;
        } else {
            return 'Variado';
        }
    }
}

@Pipe({
    name: 'withdrawInOrOut'
})
export class WithdrawInOrOutPipe implements PipeTransform {

    transform(value: string, args?: any): any {
        let toReturn;
        switch (value) {
            case 'Retirada':
                toReturn = '-';
                break;
            default:
                toReturn = '+';
                break;
        }
        return toReturn;
    }

}

@Pipe({
    name: 'nameOrUsername'
})
export class NameOrUsernamePipe implements PipeTransform {

    transform(value: User, args?: any): any {
        if (value.first_name) {
            return value.first_name + ' ' + value.last_name;
        }
        return value.username;
    }
}

@Pipe({
    name: 'typeOfSale'
})
export class TypeOfSalePipe implements PipeTransform {

    transform(value: TypeOfSale, args?: any): any {
        let toReturn;
        switch (value) {
            case TypeOfSale.TRADE:
                toReturn = 'Troca';
                break;
            case TypeOfSale.SALE:
                toReturn = 'Venda';
                break;
            case TypeOfSale.ORDER:
                toReturn = 'Encomenda';
                break;
            default:
                toReturn = 'Venda';
        }
        return toReturn;
    }
}
