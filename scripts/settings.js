var modPath = document.getElementById('mod_path_edit')
var outputPath = document.getElementById('output_path_edit')
var nameFormat = document.getElementById('name_fmt_edit')
const { ipcRenderer } = require('electron')
const { dialog } = require('electron').remote

const config = new Config(ipcRenderer.sendSync('get-setting'))

if (config.getModPath()) {
    modPath.value = config.getModPath()
}

if (config.getExtractPath()) {
    outputPath.value = config.getExtractPath()
}

if (config.getNameFormat()) {
    nameFormat.value = config.getNameFormat()
} else {
    nameFormat.value = "{name}.hack.{ext}"
    config.setNameFormat(nameFormat.value)
}

modPath.oninput = function (ev) {
    config.setModPath(modPath.value)
}

outputPath.oninput = function (ev) {
    config.setExtractPath(outputPath.value)
}

nameFormat.oninput = function (ev) {
    config.setNameFormat(nameFormat.value)
}

window.onbeforeunload = function () {
    ipcRenderer.sendSync("save-setting", config)
}

document.getElementById('mod_path_edit_button').addEventListener('click', (e, ev) => {
    dialog.showOpenDialog({ properties: ['openDirectory'], multiSelections: false }, (filePaths) => {
        modPath.value = filePaths[0]
        config.setModPath(modPath.value)
    })
})

document.getElementById('output_path_edit_button').addEventListener('click', (e, ev) => {
    dialog.showOpenDialog({ properties: ['openDirectory'], multiSelections: false }, (filePaths) => {
        outputPath.value = filePaths[0]
        config.setExtractPath(outputPath.value)
    })
})