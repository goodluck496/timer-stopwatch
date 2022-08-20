const {app, BrowserWindow} = require('electron');

// const path = require('path')

const serve = require('electron-serve');

const loadURL = serve({directory: 'renderer'});

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        alwaysOnTop: true,
        autoHideMenuBar: true,
        frame: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            webSecurity: false,
            allowRunningInsecureContent: true,
        }
    });

    loadURL(win);
    // win.loadFile('dist/timer-stopwatch/index.html',);
    win.loadURL('http://localhost')
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


app.on("browser-window-created", (e, win) => {
    win.removeMenu();
    win.setAlwaysOnTop(true);
});

app.commandLine.appendSwitch('disable-site-isolation-trials')
