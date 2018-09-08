const { app, BrowserWindow, Menu, ipcMain } = require('electron')

let win

function createWindow() {
    win = new BrowserWindow({ width: 300, height: 600 })
    win.loadFile('index.html')
    buildMenu()
    win.webContents.openDevTools()
    win.on('closed', () => {
        if (setting) {
            setting.close()
            setting = null
        }
        win = null
    })
}

function buildMenu() {
    var template = []
    if (process.platform === "darwin") {
        template.unshift({
            label: app.getName(),
            submenu: [
                {
                    label: "设置",
                    click: showSetting
                },
                {
                    role: 'close'
                }
            ]
        })
    }
    if (process.platform === "win32") {
        template.unshift({
            label: "菜单",
            submenu: [
                {
                    label: "设置",
                    click: showSetting
                },
                {
                    role: close
                }
            ]
        })
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

function showSetting(menuItem, browserWindow, event) {
    setting = new BrowserWindow({ width: 300, height: 300 })
    setting.loadFile('settings.html')
    setting.webContents.openDevTools()
    setting.on('closed', () => {
        setting = null
        if (win) {
            win.reload()
        }
    })
}


ipcMain.on("asynchronous-message", (event, arg) => {
    if (arg == "open-settings") {
        showSetting(null, null, null)
    }
})

app.on('ready', createWindow)