const {BrowserWindow} = require('electron');
const fs = require('fs');
const path = require('path');

exports.win;

exports.createWindow = async (args) => {

    const windowOptions = {
        width: 1200,
        height: 600,
        frame: true,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true // necessária <14
        }
    };

    this.win = new BrowserWindow(windowOptions);

    this.win.loadURL(global['angular_path'] + '#' + args['url']);
    this.win.webContents.openDevTools();

    if (args['url']) {
        this.win.webContents.on('did-finish-load', () => {

            console.log('Iniciando print to pdf');
            new Promise(r => setTimeout(r, 100)).then(async () => {
                console.log('Iniciando print to pdf');
                const pdfBuffer = await this.win.webContents.printToPDF({
                    marginsType: 0,
                    printBackground: true,
                    printSelectionOnly: false,
                    landscape: false,
                }, (error, data) => {
                    console.log(error);
                    console.log('data', data);
                });

                const tmpPath = path.resolve(__dirname) + '/../../print.pdf';
                fs.writeFileSync(tmpPath, pdfBuffer);

                const preview = new BrowserWindow({
                    width: 800, height: 600,
                    webPreferences: { plugins: true }
                });
                preview.loadURL('file://' + tmpPath);
                return tmpPath;
            });

        });
    }

    // Handling closing
    this.win.on('closed', () => {
        this.win = null
    })

};
