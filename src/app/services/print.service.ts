import {Injectable} from '@angular/core';
import {openTab} from '../utils';

// Equivalente web do ipcRenderer.send('pdf', {url}) do Electron: abre a rota de
// impressão em nova aba com print=1; o componente da rota dispara window.print().
@Injectable({providedIn: 'root'})
export class PrintService {

    print(urlWithQuery: string) {
        const separator = urlWithQuery.includes('?') ? '&' : '?';
        openTab('/' + urlWithQuery + separator + 'print=1');
    }
}
