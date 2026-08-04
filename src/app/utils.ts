import {School} from 'src/app/models/enum';
import {getSessionSchool} from './session-storage';

export const getStoreOptions = (allOptions = false) => {
    const school = getSessionSchool();

    const storeOptions = {
        [School.Pueri]: ['Verbo Divino', 'Aclimação', 'Itaim', 'Perdizes'],
        [School.Rio]: ['São Conrado', 'Recreio', 'Gente Miúda', 'Golfe Olímpio'],
    };

    const options = storeOptions[school];

    if (allOptions) {
        options.unshift('Todas');
    }

    return options;
};

// Abre uma rota do app em nova aba (equivalente web das BrowserWindow do Electron).
// Compatível com o hash routing: a rota vira o fragmento da URL atual.
export const openTab = (route: string): Window => {
    return window.open(window.location.origin + window.location.pathname + '#' + route, '_blank');
};

// Usado pelas rotas de impressão (tax-cupom e relatórios): quando abertas com print=1
// pelo PrintService, disparam o diálogo de impressão e fecham a aba ao final.
export const triggerPrintIfRequested = (queryParams: any) => {
    if (queryParams.print === '1') {
        setTimeout(() => {
            window.onafterprint = () => window.close();
            window.print();
        });
    }
};

export const deepClone = (value: any): any => {
    if (value === null || typeof value !== 'object') {
        return value;
    }

    // Clone Date
    if (value instanceof Date) {
        return new Date(value.getTime()) as any;
    }

    // Clone Array
    if (Array.isArray(value)) {
        return value.map(item => deepClone(item)) as any;
    }

    // Clone Object
    const clonedObj: any = {};
    for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
            clonedObj[key] = deepClone((value as any)[key]);
        }
    }
    return clonedObj;
};
