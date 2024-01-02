const { app, BrowserWindow, screen, globalShortcut, Menu, shell } = require('electron')
const os = require('os');
const isDevelopment = process.env.NODE_ENV !== 'production';
const baseUrl = 'https://cbt.ourtoga.com/login';

let mainWindow;

// checking whetheer is still on dev or live 
console.log('isDev', isDevelopment);
// the list of keys that wiil be disabled during the process
let disableKeysList = ['Alt+Tab', 'F11']
// console.log('current OS :', os);


const createWindow = () => {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
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

}

app.on('ready', () => {
    createWindow();

    // disable the key when the window has been succesfully loaded hehehe
    disableKeysList.forEach(key => {
        globalShortcut.register(key, () => {
            console.log(`${key} is disabled!`);

        })
    });
    


})


