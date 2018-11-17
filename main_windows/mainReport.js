const {BrowserWindow} = require('electron');
const fs = require('fs');
const path = require('path');
const url = require('url');
const PDFWindow = require('electron-pdf-window');

exports.win;

exports.createWindow = (args) => {

    const windowOptions = {
        width: 1200,
        height: 600,
        frame: false,
        show: false
    };

    const someArgs = args;
    const indexPath = path.resolve(__dirname, '..', 'src', 'reports', 'html', args['url']);
    args['u'] = path.resolve(__dirname) + '/../../print.pdf';
    const indexUrl = url.format({
        protocol: 'file',
        pathname: indexPath,
        slashes: true,
        hash: encodeURIComponent(JSON.stringify(someArgs))
    });

    this.win = new BrowserWindow(windowOptions);

    // Load main window content
    this.win.loadURL(indexUrl);

    this.win.webContents.openDevTools();


    this.win.webContents.on('did-finish-load', () => {
        // Use default printing options
        this.win.webContents.printToPDF({
            marginsType: 0,
            printBackground: true,
            printSelectionOnly: false,
            landscape: false,
        }, (error, data) => {
            if (error) throw error;
            const my_path = path.resolve(__dirname) + '/../../print.pdf';
            fs.writeFile(my_path, data, (error) => {
                if (error) throw error;
                const winPDF = new PDFWindow({
                    width: 800,
                    height: 600
                });

                winPDF.loadURL(path.resolve(__dirname) + '/../../print.pdf');
                // this.win.close();
            })
        })
    });

    // Handling closing

    this.win.on('closed', () => {
        this.win = null
    })

};
