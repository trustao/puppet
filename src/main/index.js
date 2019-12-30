import { app, BrowserWindow, screen, ipcMain} from 'electron'
import path from 'path'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  mainWindow = new BrowserWindow({
    useContentSize: true,
    width,
    height: height - 60,
    x: 0,
    y: 0,
    // webPreferences: {
    //   nodeIntegration: true,
    //   preload: path.resolve(__dirname, 'web-preload.js')
    // }
  })

  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    // Set the save path, making Electron not to prompt a save dialog.
    //
    const dirPath = path.resolve(__dirname,process.env.NODE_ENV === 'development' ? './static/temp' : '../../../temp')
    const filePath = path.join(dirPath, item.getFilename())
    mainWindow.webContents.send('main-download', {
      status: 'processing',
      path: filePath,
      dirPath,
      name: item.getFilename(),
      type: item.getMimeType()
    })
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
        mainWindow.webContents.send('main-download', {
          status: 'success',
          path: filePath,
          dirPath,
          name: item.getFilename(),
          type: item.getMimeType()
        })
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
    item.setSavePath(filePath)
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

ipcMain.on('user-events', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
