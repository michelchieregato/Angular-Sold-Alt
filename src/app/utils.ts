import {School} from 'src/app/models/enum';

declare const window: any;
const {remote} = window.require('electron');

export const getStoreOptions = (allOptions = false) => {
    const school = remote.getGlobal('school');

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
