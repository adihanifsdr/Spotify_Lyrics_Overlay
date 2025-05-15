const { app, BrowserWindow, screen, Tray, Menu } = require("electron");
const path = require("node:path");
// const { electronApp, optimizer } = require("@electron-toolkit/utils");

let mainWindow;
let tray;

function createWindow(height) {
  mainWindow = new BrowserWindow({
    width: 350,
    height: height,
    show: false,
    x: 0,
    y: 0,
    transparent: true,
    alwaysOnTop: true,
    frame: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "icon.png"),
    webPreferences: {
      contextIsolation: true,
      sandbox: false,
    },
  });

  // Make window non-clickable (ignores all mouse events)
  mainWindow.setIgnoreMouseEvents(true);

  mainWindow.setAlwaysOnTop(true, "screen-saver");

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  //   // Set app user model id for Windows
  //   electronApp.setAppUserModelId("com.electron");

  //   // Watch for dev tools shortcuts
  //   app.on("browser-window-created", (_, window) => {
  //     optimizer.watchWindowShortcuts(window);
  //   });

  createWindow(height);

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  tray = new Tray(path.join(__dirname, "icon.png"));

  const trayMenu = Menu.buildFromTemplate([
    {
      label: "Vertical Layout",
      click: () => {
        mainWindow.setSize(350, height);
      },
    },
    {
      label: "Horizontal Layout",
      click: () => {
        mainWindow.setSize(width, 150);
      },
    },
    {
      label: "Draggable",
      click: () => {
        mainWindow.setIgnoreMouseEvents(false);
      },
    },
    {
      label: "Static",
      click: () => {
        mainWindow.setIgnoreMouseEvents(true);
      },
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => app.quit(),
    },
  ]);

  tray.setToolTip("Lyrics Overlay");
  tray.setContextMenu(trayMenu);
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
