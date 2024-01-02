const { app, BrowserWindow, screen, globalShortcut, Menu, shell } = require('electron');
const electronLocalshortcut = require('electron-localshortcut');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { electron } = require('process');
const isDevelopment = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';
const isLinux = process.platform === "linux";
const baseUrl = 'https://cbt.ourtoga.com/login';


let toggleFullScreenKey = '';
!isDevelopment ? toggleFullScreenKey = 'F11' : toggleFullScreenKey = 'PrintScreen';


const disableKey = ['Alt+Tab','Super', toggleFullScreenKey];
let mainWindow;

// console.log('the current os is :', os);
console.log('isDev', isDevelopment);
console.log('Ismac?', isMac);
console.log('togglekey:', toggleFullScreenKey);


const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: `${__dirname}/assets/img/ourtoga-03.png`,
        fullscreen: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(baseUrl);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    isDevelopment ? mainWindow.webContents.openDevTools() : isDevelopment = false

    // disable all + tab during opening the application


    mainWindow.on('closed', () => {
        mainWindow == null;
    })

    // thiss will be fucking set the screen to fullscreen
    mainWindow.webContents.on('dom-ready', () => {
        mainWindow.setFullScreen(true);
        console.log('this is will be set to true');
    });
}


app.on('ready', () => {

    createWindow();
    const currentDisplayNazi = screen.getPrimaryDisplay();
    const getAllDisplay = screen.getAllDisplays();
    const { width, height } = currentDisplayNazi.workAreaSize;
    mainWindow = new BrowserWindow({ width, height });
    mainWindow.loadURL(baseUrl);

    disableKey.forEach(key => {
        if (key != 'Super') {
            globalShortcut.register(key, () => {
                console.log(`The ${key} is disabled`);
            })
        }
        else{
            // electronLocalshortcut.register(mainWindow, key, ()=>{
            //     console.log(`The ${key} is disable`)
            // })
        }
    })



    // to detect
    const externalDisplay = getAllDisplay.find(display => {
        return display;
    })
    
     if(externalDisplay != null){
        console.log('External display:', externalDisplay);
     }

});

const template = [
    // { role: 'appMenu' }
    ...(isMac
        ? [{
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }]
        : []),
    // { role: 'fileMenu' }
    {
        label: 'File',
        submenu: [
            isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    // { role: 'editMenu' }
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            ...(isMac
                ? [
                    { role: 'pasteAndMatchStyle' },
                    { role: 'delete' },
                    { role: 'selectAll' },
                    { type: 'separator' },
                ]
                : [
                    { role: 'delete' },
                    { type: 'separator' },
                    { role: 'selectAll' }
                ])
        ]
    },
    // { role: 'viewMenu' }
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    // { role: 'windowMenu' }
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(isMac
                ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ]
                : [
                    { role: 'close' }
                ])
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'About US',
                click: async () => {
                    await shell.openExternal('https://ourtoga.com/')
                }
            }
        ]
    }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});


