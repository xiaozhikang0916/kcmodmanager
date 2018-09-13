const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const Config = require('./scripts/config')

let win
let setting
let config = new Config(path.join(app.getPath('appData'), 'kcmodmanager'))

function createWindow() {
    win = new BrowserWindow({ width: 1200, height: 600 })
    win.loadFile('index.html')
    buildMenu()
    win.on('closed', () => {
        if (setting) {
            setting.close()
            setting = null
        }
        win = null
    })

}

function buildMenu() {
    var template = [{
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]
    }]
    if (process.platform === "darwin") {
        template.unshift({
            label: app.getName(),
            submenu: [
                {
                    role: 'reload',
                    accelerator: 'F5'
                },
                {
                    label: "打开开发者工具",
                    click: showDevTool,
                    accelerator: "F2"
                },
                {
                    role: 'quit',
                    accelerator: "Cmd+Q"
                }
            ]
        })
    }
    if (process.platform === "win32") {
        template.unshift({
            label: "菜单",
            submenu: [
                {
                    role: 'reload',
                    accelerator: 'F5'
                },
                {
                    label: "打开开发者工具",
                    click: showDevTool,
                    accelerator: "F2"
                },
                {
                    role: 'close'
                }
            ]
        })
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

function showSetting(menuItem, browserWindow, event) {
    if (setting == null) {
        setting = new BrowserWindow({ width: 500, height: 300 })
        setting.loadFile('settings.html')
        setting.on('closed', () => {
            setting = null
            if (win) {
                win.reload()
            }
        })
    }
}

function showDevTool(menuItem, browserWindow, event) {
    browserWindow.webContents.openDevTools()
}


ipcMain.on("asynchronous-message", (event, arg) => {
    if (arg == "open-settings") {
        showSetting(null, null, null)
    }
})

ipcMain.on("get-setting", (event, arg) => {
    event.returnValue = config
})

ipcMain.on("save-setting", (event, arg) => {
    config = new Config(arg)
    config.saveConfig()
    event.returnValue = true
})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    app.quit();
});