const { app, BrowserWindow, screen, globalShortcut, Menu, shell } = require('electron')
const os = require('os');
const isDevelopment = process.env.NODE_ENV !== 'production';
const baseUrl = 'https://cbt.ourtoga.com/login';
const isMac = process.platform === 'darwin';

let mainWindow;

// checking whetheer is still on dev or live 
console.log('isDev', isDevelopment);
// the list of keys that wiil be disabled during the process
let disableKeysList = ['Alt+Tab', 'F11']
// console.log('current OS :', os);


const createWindow = () => {

    const display = screen.getPrimaryDisplay();
    const { height, width } = display.workAreaSize;

    mainWindow = new BrowserWindow({
        height: height,
        width: width,
        fullscreen: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(baseUrl);

    mainWindow.on('closed', () => {
        mainWindow = null;
    })

    // currentDisplay();
    // this.externalDisplay();

}

app.on('ready', () => {

    createWindow();
    createMenu();
    // disable the key when the window has been succesfully loaded hehehe
    disableKeysList.forEach(key => {
        globalShortcut.register(key, () => {
            console.log(`${key} is disabled!`);
        })
    });
})

// to detect if the user ha s more than one displays
function externalDisplay() {
    const display = screen.getAllDisplays();
    const external = display.find(display => {
        if (external != null) {
            return console.log('External display:', externalDisplay);
        }
        else {
            return console.log('No secondary display is detected!')
        }
    })
}

const createMenu = () => {
    
}


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
    if (!isMac) app.quit;
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
})

