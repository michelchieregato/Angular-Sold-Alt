const electron = require('electron');

// Module to control application life.
const {app, ipcMain, net} = electron;
// Essa a gente que criou
const mainWindow = require('./mainWindow');
// const mainWithdraw = require('./mainWithdraw');
// const mainAlert = require('./mainAlert');
// const mainMenu_admin = require('./mainMenu_admin');
// const mainReport = require('./mainReport');
const mainSale = require('./mainSale');
// const mainClient = require('./mainClient');
// const updater = require('./updater');
// const Store = require('./storage.js');

// para mexer com o config file
const ini = require('ini');
const fs = require('fs');
const path = require('path');
const os = require('os');
const config_path = path.resolve(__dirname, '..', 'config', 'config.ini');
const config = ini.parse(fs.readFileSync(config_path, 'utf-8'));
const crypto = require('crypto');
const cryptoAlgo = 'aes-128-cbc';
const cryptoPassword = 'soldalt';

// funções de crypto
function encrypt(text)
{
    let cipher = crypto.createCipher(cryptoAlgo, cryptoPassword);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted
}

function decrypt(crypted)
{
    let decipher = crypto.createDecipher(cryptoAlgo, cryptoPassword);
    let text = decipher.update(crypted, 'hex', 'utf8');
    text += decipher.final('utf8');
    return text
}

global['default_url'] = '/api/';
// global['default_url'] = 'http://www.pueristore.com.br/django_sold_alt/';
global['user'] = {};
global['store'] = decrypt(config.storeName);
// global['LojaCEP'] = decrypt(config.storeCEP);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.on('ready', () => {
    mainWindow.createWindow({'url': 'login.html'});

    // Check for updates after 2 seconds
    // setTimeout(updater.check, 2000);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        mainWindow.createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Comunicação login
ipcMain.on('ready', () => {
    mainWindow.createWindow({'url': 'login.html'})
});

ipcMain.on('setUser', ( event, user ) => {
    global['user'] = user;
} );

// Tela de venda
ipcMain.on('open-sale-screen', (e, args) => {
    mainSale.createWindow()
});
// Tela pdf
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
                console.log(Object.keys(JSON.parse(chunk)).length === 0)
                if (! (Object.keys(JSON.parse(chunk)).length === 0)){
                    console.log('I am here')
                    users.set(JSON.parse(chunk)['response'])
                }
            });
            response.on('end', () => {
                console.log('No more data in response.')
            })
        });
        request.end();
    } catch (e) {
        console.log(e)
    }

});

ipcMain.on('get-json', (e, args) => {
    const users = new Store({
        configName: args['from'],
        defaults: []
    });

    ipcMain.send('retreive-json', {'back': users.get()})
})
