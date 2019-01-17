import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'paymentPipe'
})
export class PaymentPipe implements PipeTransform {

    transform(value: Array, args?: any): any {
        console.log(value);
        if (!value.length) {
            return '?';
        } else if (value.length === 1) {
            return value[0].paymentMethod;
        } else {
            return 'Variado';
        }
    }

}
