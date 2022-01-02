import { School } from 'src/app/models/enum';
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
