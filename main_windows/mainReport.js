const {BrowserWindow} = require('electron');
const fs = require('fs');
const path = require('path');
const PDFWindow = require('electron-pdf-window');

exports.win;

exports.createWindow = (args) => {

    const windowOptions = {
        width: 1200,
        height: 600,
        frame: true,
        show: false
    };

    this.win = new BrowserWindow(windowOptions);

    // Load main window content
    this.win.loadURL(global['angular_path'] + '#' + args['url']);

    this.win.webContents.openDevTools();

    if (args['url']) {
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
                    this.win.close();
                })
            })
        });
    }

    // Handling closing

    this.win.on('closed', () => {
        this.win = null
    })

};
