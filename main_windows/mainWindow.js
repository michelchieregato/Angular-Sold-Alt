// Modules
const { BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const remoteMain = require('@electron/remote/main');  // ✅ import no main process

remoteMain.initialize(); // inicializa o remote no main

// BrowserWindow instance
exports.win;

exports.showUrl = (args) => {
    const someArgs = args;
    const indexPath = path.resolve(__dirname, '..', 'src', 'html', args.url);
    const indexUrl = url.format({
        protocol: 'file',
        pathname: indexPath,
        slashes: true,
        hash: encodeURIComponent(JSON.stringify(someArgs))
    });
    this.win.loadURL(indexUrl);
};

exports.createWindow = (args) => {
    const windowOptions = {
        width: 1300,
        height: 800,
        minWidth: 1100,
        minHeight: 600,
        autoHideMenuBar: true,
        fullscreen: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true // necessária <14
        }
    };

    this.win = new BrowserWindow(windowOptions);

    this.win.loadURL(global.angular_path);

    this.win.on('closed', () => {
        this.win = null;
    });
};
