import {School} from './models/enum';

// Sessão da aplicação em localStorage — substitui os globals do processo main do Electron.
// Funções puras (sem DI) porque os initial states do ngrx são avaliados no load do módulo,
// antes de qualquer injeção de dependência.

const KEYS = {
    token: 'soldalt.token',
    user: 'soldalt.user',
    store: 'soldalt.store',
    school: 'soldalt.school',
};

// Mesmos defaults do config.ini do desktop
const DEFAULT_STORE = 'Verbo Divino';
const DEFAULT_SCHOOL = School.Pueri;

export const getSessionToken = (): string => {
    return localStorage.getItem(KEYS.token);
};

export const setSessionToken = (token: string) => {
    localStorage.setItem(KEYS.token, token);
};

export const getSessionUser = (): any => {
    const raw = localStorage.getItem(KEYS.user);
    return raw ? JSON.parse(raw) : {};
};

export const setSessionUser = (user: any) => {
    localStorage.setItem(KEYS.user, JSON.stringify(user));
};

export const getSessionStore = (): string => {
    return localStorage.getItem(KEYS.store) || DEFAULT_STORE;
};

export const setSessionStore = (store: string) => {
    localStorage.setItem(KEYS.store, store);
};

export const getSessionSchool = (): School => {
    const raw = localStorage.getItem(KEYS.school);
    return raw === null ? DEFAULT_SCHOOL : Number(raw);
};

export const setSessionSchool = (school: School) => {
    localStorage.setItem(KEYS.school, String(school));
};

export const clearSession = () => {
    Object.keys(KEYS).forEach((key) => localStorage.removeItem(KEYS[key]));
};
