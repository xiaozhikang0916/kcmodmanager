zip = require('jszip')
fs = require('fs')
path = require('path')
var querystring = require("querystring");
const { ipcRenderer } = require('electron')
var content = document.getElementById("mod_list")
var infoFrame = document.getElementById("mod_info")

function addModToList(modFile) {
    let element = document.createElement("div")
    let basename = path.basename(modFile)
    var index = basename.lastIndexOf('.')
    let name = basename
    if (index > 0) {
        name = basename.substring(0, index)
    }
    element.id = name
    element.classList.add("moditem")
    let installed = isModInstalled(name)
    if (installed) {
        element.classList.add("installed")
    } else {
        element.classList.remove("installed")
    }
    element.addEventListener('click', (ev) => {
        resetSelectedMod()
        element.classList.add('selected')
        infoFrame.src = ("./modinfo.html?" + querystring.stringify({mod: name}))
    })
    let text = document.createElement("p")
    text.classList.add("modname")
    /* TODO 
    read name from extracted info file
    but new it is an async function to extract zip file
    it would make ui flashing*/
    text.textContent = name
    element.appendChild(text)
    element.appendChild(generateButton(name, installed))
    readModInfo(name, modFile)
    content.append(element)
}

const INFO_LIST = [
    /readme\.md/,
    /info\.json/,
    /icon\.*/,
    /readme\//
]
function readModInfo(name, modFile) {
    const infoPath = path.join(getModPath(), ".modinfo", name)
    fs.readFile(modFile, function (err, data) {
        if (err) {
            console.log("Read zip failed")
        }
        else {
            zip.loadAsync(data)
                .then(function (file) {
                    file.forEach(function (relativePath, entry) {
                        if (relativePath.startsWith("kcs2") && !entry.dir) {
                            INFO_LIST.forEach((item) => {
                                if (relativePath.search(item) > -1) {
                                    entry.async('nodebuffer').then(function (filecontent) {
                                        var dir = path.parse(relativePath).dir
                                        if (!fs.existsSync(dir)) {
                                            mkDirByPathSync(path.join(infoPath, dir))
                                        }
                                        fs.writeFileSync(path.join(infoPath, relativePath), filecontent)
                                    })
                                }
                            })
                            
                        }
                    })
                },
                    function (reason) {
                        console.log("read zip failed " + reason)
                    })
        }
    })
}

function resetSelectedMod() {
    const sections = document.querySelectorAll('.moditem.selected')
    sections.forEach((section) => {
      section.classList.remove('selected')
    })
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
    var setting = document.getElementById("settings")
    setting.addEventListener('click', (ev) => {
        ipcRenderer.send('asynchronous-message', "open-settings")
    })
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