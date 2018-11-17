const {BrowserWindow} = require('electron');

const path = require('path');
const url = require('url');

exports.win;

exports.createWindow = (args) => {

    const windowOptions = {
        width: 1000,
        height: 450,
        autoHideMenuBar: true,
    };

    const someArgs = args;
    const indexPath = path.resolve(__dirname, '..', 'src', 'html', args['url']);
    const indexUrl = url.format({
        protocol: 'file',
        pathname: indexPath,
        slashes: true,
        hash: encodeURIComponent(JSON.stringify(someArgs))
    });

    this.win = new BrowserWindow(windowOptions);

    // Load main window content
    this.win.loadURL(indexUrl);

    // Handling closing
    this.win.on('closed', () => {
        this.win = null
    })

};