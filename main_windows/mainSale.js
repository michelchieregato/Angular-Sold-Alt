// Modules
const {BrowserWindow} = require('electron');

// BrowserWindow instance
exports.win

// mainWindow createWindow fn
exports.createWindow = () => {

    const windowOptions = {
        width: 1300,
        height: 800,
        minWidth: 1100,
        minHeight: 600,
        autoHideMenuBar: true,
        fullscreen: false,
    };

    this.win = new BrowserWindow(windowOptions);

    // Load main window content
    this.win.loadURL(global['angular_path'] + '#sale/new-sale');

    // Handle window closed
    this.win.on('closed', () => {
        this.win = null
    })
};
