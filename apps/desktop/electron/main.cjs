const path = require("node:path")

const { app, BrowserWindow, shell } = require("electron")

/**
 * Minimal Electron shell for the Seldon editor.
 *
 * In development it loads the React editor's Vite dev server. When packaged it
 * loads the built editor copied into the app resources under `editor/`. This is
 * a thin shell on purpose: it owns the window and nothing about the editor.
 */
const DEV_URL = process.env.SELDON_DEV_URL ?? "http://localhost:5173"

function resolveEditorIndex() {
  return path.join(process.resourcesPath, "editor", "index.html")
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    backgroundColor: "#111111",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Open target=_blank and external links in the OS browser, not a new window.
  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)

    return { action: "deny" }
  })

  if (app.isPackaged) {
    window.loadFile(resolveEditorIndex())
  } else {
    window.loadURL(DEV_URL)
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
