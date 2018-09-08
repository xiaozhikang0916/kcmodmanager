zip = require('jszip')
fs = require('fs')
path = require('path')
const {ipcRenderer} = require('electron')
var content = document.getElementById("mod_list")

function addModToList(modFile) {
    let element = document.createElement("div")
    let name = path.basename(modFile)
    element.id = name
    element.classList.add("moditem")
    let installed = isModInstalled(name)
    if (installed) {
        element.classList.add("installed")
    } else {
        element.classList.remove("installed")
    }
    let text = document.createElement("p")
    text.classList.add("modname")
    text.textContent = name
    element.appendChild(text)
    element.appendChild(generateButton(name, installed))

    content.append(element)
}

function generateButton(modfile, installed) {
    let element = document.createElement("div")
    element.classList.add("modbutton")
    if (installed) {
        element.classList.add("installed")
    }
    else {
        element.classList.remove("installed")
    }
    element.addEventListener("click", function (e, ev) {
        if (isModInstalled(modfile)) {
            uninstallMod(modfile)
            element.classList.remove("installed")
        } else {
            installMod(modfile)
            element.classList.add("installed")
        }
    })
    return element
}

function createPage() {
    if (!validConfig()) {
        console.log("Setting invalid!")
        ipcRenderer.send('asynchronous-message', "open-settings")
    } else {
        console.log("Setting valid, start loading")
        loadMods()
    }
}

function loadMods() {
    fs.readdir(getModPath(), function (err, fileList) {
        if (err) return err;
        fileList.forEach(function (file) {
            if (file.endsWith(".zip")) {
                file = path.resolve(getModPath(), file)
                fs.stat(file, function (err, stat) {
                    if (stat && stat.isFile()) {
                        addModToList(file)
                    }
                })
            }
        })
    })
}

createPage()