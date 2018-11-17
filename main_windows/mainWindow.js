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

    const someArgs = args;
    const indexPath = path.resolve('http://localhost:4200', '');
    const indexUrl = url.format({
        protocol: 'file',
        pathname: 'http://localhost:4200',
        slashes: true,
        hash: encodeURIComponent(JSON.stringify(someArgs))
    });

    this.win = new BrowserWindow(windowOptions);

    // Load main window content
    // this.win.loadURL('http://localhost:4200/');
    // this.win.loadURL('file:///C:\\Users\\miche\\Desktop\\Projetos\\Sold Alt\\angular_sold_alt\\angular-sold-alt\\dist\\index.html#seller')
    console.log(url.format({
        //__dirname is the current working dir
        pathname: path.join(__dirname, '..', 'dist', 'index.html'),
        protocol: 'file:',
        slashes: true,
        hash: 'seller'
    }))

    this.win.loadURL(url.format({
        //__dirname is the current working dir
        pathname: path.join(__dirname, '..', 'dist', 'index.html'),
        protocol: 'file:',
        slashes: true,
        // hash: 'seller'
    }));
    // // Handle window closed
    this.win.on('closed', () => {
        this.win = null
    })
};
