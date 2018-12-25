import {Directive, HostListener, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Directive({
    selector: '[appMask]',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: CpfMaskDirective,
        multi: true
    }]
})
export class MaskDirective implements ControlValueAccessor {
    onTouched: any;
    onChange: any;

    @Input('appCpfMask') maskValue: string;

    writeValue(value: any): void {
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    constructor() {
    }

    @HostListener('keyup', ['$event'])
    onKeyup($event: any) {
        let valor = $event.target.value.replace(/\D/g, '');
        const pad = this.maskValue.replace(/\D/g, '').replace(/9/g, '_');
        const valorMask = valor + pad.substring(0, pad.length - valor.length);

        // retorna caso pressionado backspace
        if ($event.keyCode === 8) {
            this.onChange(valor);
            return;
        }

        if (valor.length <= pad.length) {
            this.onChange(valor);
        }

        let valorMaskPos = 0;
        valor = '';
        for (let i = 0; i < this.maskValue.length; i++) {
            if (isNaN(parseInt(this.maskValue.charAt(i)))) {
                valor += this.maskValue.charAt(i);
            } else {
                valor += valorMask[valorMaskPos++];
            }
        }

        if (valor.indexOf('_') > -1) {
            valor = valor.substr(0, valor.indexOf('_'));
        }

        $event.target.value = valor;
        this.maskValue = 'Oi mulecada'
    }

    @HostListener('blur', ['$event'])
    onBlur($event: any) {
        if ($event.target.value.length === this.maskValue.length) {
            return;
        }
        this.onChange('');
        $event.target.value = '';
    }

}
