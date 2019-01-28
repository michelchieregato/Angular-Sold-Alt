import {Pipe, PipeTransform} from '@angular/core';
import {User} from '../models/user.model';

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
