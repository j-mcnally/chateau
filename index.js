const {app, BrowserWindow} = require('electron')
const portfinder = require('portfinder')
const chateau = require('./app.js')
const configFile = require('./config.js');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let server
let server_port

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})
  if (server_port) {
    win.loadURL(`http://localhost:${server_port}/index.html`)
  }
  else {
    portfinder.basePort = 63000
    portfinder.getPort(function (err, port) {
      // Start the app with the port
      let config = Object.assign({}, configFile)
      config.expressPort = port;
      chateau(config).then(function(app) {
        server = app;
        server_port = port;
        win.loadURL(`http://localhost:${server_port}/index.html`)
      });
    });
  }
  // and load the index.html of the app.

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
