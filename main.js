const { app, BrowserWindow, Menu, ipcMain } = require('electron')

let win
let setting

function createWindow() {
    win = new BrowserWindow({ width: 300, height: 600 })
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
        ]}]
    if (process.platform === "darwin") {
        template.unshift({
            label: app.getName(),
            submenu: [
                {
                    label: "打开开发者工具",
                    click: showDevTool
                },
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
                    label: "打开开发者工具",
                    click: showDevTool
                },
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
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

function showSetting(menuItem, browserWindow, event) {
    setting = new BrowserWindow({ width: 500, height: 300 })
    setting.loadFile('settings.html')
    setting.on('closed', () => {
        setting = null
        if (win) {
            win.reload()
        }
    })
}

function showDevTool(menuItem, browserWindow, event) {
    browserWindow.webContents.openDevTools()
}


ipcMain.on("asynchronous-message", (event, arg) => {
    if (arg == "open-settings") {
        showSetting(null, null, null)
    }
})

app.on('ready', createWindow)