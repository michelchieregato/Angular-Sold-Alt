// Modules
const {BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

// BrowserWindow instance
exports.win

exports.showUrl = (args) => {
    const someArgs = args;
    const indexPath = path.resolve(__dirname, '..', 'src', 'html', args['url']);
    const indexUrl = url.format({
        protocol: 'file',
        pathname: indexPath,
        slashes: true,
        hash: encodeURIComponent(JSON.stringify(someArgs))
    });
    this.win.loadURL(indexUrl);
};

// mainWindow createWindow fn
exports.createWindow = (args) => {

    const windowOptions = {
        width: 1300,
        height: 800,
        minWidth: 1100,
        minHeight: 600,
        autoHideMenuBar: true,
        fullscreen: false,
    };

    const indexUrl = url.format({
        protocol: 'file',
        pathname: 'http://localhost:4200',
        slashes: true,
        // hash: 'seller'
    });

    this.win = new BrowserWindow(windowOptions);

    // With ng serve
    this.win.loadURL('http://localhost:4200/');

    // Production
    // this.win.loadURL(indexUrl);

    // this.win.webContents.openDevTools();
    // // Handle window closed
    this.win.on('closed', () => {
        this.win = null
    })
};
