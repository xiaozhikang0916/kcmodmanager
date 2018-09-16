fs = require('fs')
path = require('path')
const { ipcRenderer } = require('electron')
var content = document.getElementById("mod_list")
var mainPage = document.getElementById("mod_info")
const template = document.querySelector('template')
const pageNode = document.importNode(template.content, true)
const config = new Config(ipcRenderer.sendSync('get-setting'))

function addModToList(modFile) {
    let element = document.createElement("div")
    let name = path.basename(modFile)
    element.id = name
    element.classList.add("moditem")
    let installed = config.isModInstalled(name)
    if (installed) {
        element.classList.add("installed")
    } else {
        element.classList.remove("installed")
    }
    element.addEventListener('click', (ev) => {
        resetSelectedMod()
        element.classList.add('selected')
        let page = document.getElementById(`mod_info_${name}`)
        page.classList.add("shown")
    })
    let text = document.createElement("p")
    text.classList.add("modname")
    text.textContent = name
    element.appendChild(text)
    mainPage.appendChild(buildInfoPage(name, pageNode.cloneNode(true)))
    content.append(element)
}

function resetSelectedMod() {
    const sections = document.querySelectorAll('.moditem.selected')
    sections.forEach((section) => {
        section.classList.remove('selected')
    })

    const pages = document.querySelectorAll('.info_page.shown')
    pages.forEach((page) => {
        page.classList.remove('shown')
    })
}

function createPage() {
    var setting = document.getElementById("settings")
    setting.addEventListener('click', (ev) => {
        ipcRenderer.send('asynchronous-message', "open-settings")
    })
    if (!config.validConfig()) {
        console.log("Setting invalid!")
        ipcRenderer.send('asynchronous-message', "open-settings")
    } else {
        console.log("Setting valid, start loading")
        loadMods()
    }
}

function loadMods() {
    fs.readdir(config.getModPath(), function (err, fileList) {
        if (err) return err;
        fileList.forEach(function (file) {
            var currentPath = path.resolve(config.getModPath(), file)
            if (!file.startsWith('.') && fs.statSync(currentPath).isDirectory()) {
                try {
                    var kcs = fs.statSync(path.resolve(currentPath, "kcs2"))
                    if (kcs && kcs.isDirectory()) {
                        addModToList(file)
                    }
                } catch (ENONET) {
                    console.error(`${file} is not valid mod package`)
                }
            }
        })
    })
}

createPage()