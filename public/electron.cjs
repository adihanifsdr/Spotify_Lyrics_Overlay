const { app, BrowserWindow, screen, Tray, Menu } = require("electron");
const path = require("node:path");
require("dotenv").config(); // Load .env

const port = process.env.VITE_PORT;
// const { electronApp, optimizer } = require("@electron-toolkit/utils");

let mainWindow;
let tray;
let isLoginMode = false;

function createWindow(height) {
  mainWindow = new BrowserWindow({
    width: 350,
    height: height,
    show: false,
    x: 0,
    y: 0,
    transparent: true,
    alwaysOnTop: true,
    frame: false, //if you have to log into spotify change to true and restart program
    autoHideMenuBar: true,
    icon: path.join(__dirname, "icon.png"),
    webPreferences: {
      contextIsolation: true,
      sandbox: false,
    },
  });

  // Make window non-clickable (ignores all mouse events)
  mainWindow.setIgnoreMouseEvents(true); //if you have to log into spotify turn to false and restart program

  mainWindow.setAlwaysOnTop(true, "screen-saver");

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.loadURL(`http://localhost:${port}`);
}

function toggleLoginMode() {
  isLoginMode = !isLoginMode;
  
  if (isLoginMode) {
    // Enable login mode
    mainWindow.setIgnoreMouseEvents(false);
    mainWindow.setFrame(true);
    mainWindow.setAlwaysOnTop(false);
    mainWindow.center();
    console.log("✅ Login mode enabled - window is now clickable");
  } else {
    // Disable login mode (back to overlay)
    mainWindow.setIgnoreMouseEvents(true);
    mainWindow.setFrame(false);
    mainWindow.setAlwaysOnTop(true, "screen-saver");
    console.log("✅ Overlay mode enabled - window is now transparent overlay");
  }
  
  // Update the tray menu
  updateTrayMenu();
}

function updateTrayMenu() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  const trayMenu = Menu.buildFromTemplate([
    {
      label: isLoginMode ? "✅ Login Mode (Clickable)" : "🔐 Enable Login Mode",
      click: toggleLoginMode,
    },
    { type: "separator" },
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

  tray.setContextMenu(trayMenu);
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
  tray.setToolTip("Lyrics Overlay");
  
  // Initialize the tray menu
  updateTrayMenu();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
