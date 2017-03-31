const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {

    // let displays = electron.screen.getAllDisplays()
    // let externalDisplay = displays.find((display) => {
    //  return display.bounds.x !== 0 || display.bounds.y !== 0
    // })

    //console.log(externalDisplay)
    mainWindow = new BrowserWindow({
        //  width: externalDisplay.workArea.width,
        //  height: externalDisplay.workArea.height
    })
    mainWindow.loadURL('file://' + __dirname + '/index.html')
    mainWindow.webContents.openDevTools({ mode: 'bottom' })

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})