const { app, BrowserWindow } = require("electron");

const server = require('./app');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    title: "Auction Chain",
    webPreferences: {
      nodeIntegration: true,
    },
    autoHideMenuBar: true,
    icon: 'client/src/assets/icon.png'
  });

  mainWindow.loadURL("http://localhost:3000");
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("resize", function (e, x, y) {
  mainWindow.setSize(x, y);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});