const electron = require('electron');
const { app, ipcMain, net } = electron;
const mainWindow = require('./mainWindow');
const mainOrder = require('./mainOrder');
const mainReport = require('./mainReport');
const mainSale = require('./mainSale');
const Store = require('./storage');
const ini = require('ini');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PUERI = 0;
const RIO = 1;

const config_path = (electron.app || electron.remote.app).getPath('userData') + '/config.ini';

// garante defaults
let config = {
    storeName: 'Verbo Divino',
    school: PUERI
};

// tenta carregar o arquivo ini
if (fs.existsSync(config_path)) {
    try {
        const parsed = ini.parse(fs.readFileSync(config_path, 'utf-8'));
        config = {
            storeName: parsed.storeName || 'Verbo Divino',
            school: parsed.school !== undefined ? parseInt(parsed.school) : PUERI
        };
    } catch (e) {
        console.error("Erro ao ler config.ini, usando defaults:", e);
    }
} else {
    // se não existir, cria o arquivo com defaults
    const defaultIniContent = ini.stringify({
        storeName: 'Verbo Divino',
        school: PUERI
    });
    fs.writeFileSync(config_path, defaultIniContent);
}

global['default_url'] = '/api/';
global['angular_path'] = 'http://localhost:4200/';
global['user'] = {};
global['store'] = config.storeName;
global['school'] = config.school;

console.log('Config carregada:', config);

app.on('ready', () => {
    mainWindow.createWindow({ 'url': 'login.html' });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        mainWindow.createWindow();
    }
});

ipcMain.on('ready', () => {
    mainWindow.createWindow({ 'url': 'login.html' });
});

ipcMain.on('setUser', (event, user) => {
    global['user'] = user;
});

ipcMain.on('setStore', (event, store) => {
    global['store'] = store;
});

ipcMain.on('setSchool', (event, school) => {
    global['school'] = school;
});

ipcMain.on('open-sale-screen', (e, args) => {
    mainSale.createWindow();
});

ipcMain.on('open-order-screen', (e, args) => {
    mainOrder.createWindow(args);
});

ipcMain.on('pdf', (e, args) => {
    mainReport.createWindow(args);
});

ipcMain.on('update-json', (e, args) => {
    const users = new Store({
        configName: 'users',
        defaults: []
    });

    try {
        const request = net.request(global['default_url'] + 'login/get-all');

        request.on('response', (response) => {
            response.on('data', (chunk) => {
                if (Object.keys(JSON.parse(chunk)).length !== 0) {
                    users.set(JSON.parse(chunk)['response']);
                }
            });
            response.on('end', () => {
                console.log('No more data in response.');
            });
        });
        request.end();
    } catch (e) {
        console.log(e);
    }
});

ipcMain.on('get-json', (e, args) => {
    const users = new Store({
        configName: args['from'],
        defaults: []
    });

    ipcMain.send('retreive-json', { 'back': users.get() });
});
