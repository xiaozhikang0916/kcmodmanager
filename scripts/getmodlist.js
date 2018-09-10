zip = require('jszip')
fs = require('fs')
path = require('path')
const { ipcRenderer } = require('electron')
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
    element.addEventListener('click', (ev) => {
        resetSelectedMod()
        element.classList.add('selected')
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
function readModInfo(basename, modFile) {
    var index = basename.lastIndexOf('.')
    var dirname = basename
    if (index > 0) {
        dirname = basename.substring(0, index)
    }
    const infoPath = path.join(getModPath(), ".modinfo", dirname)
    fs.readFile(modFile, function (err, data) {
        if (err) {
            console.log("Read zip failed")
        }
        else {
            zip.loadAsync(data)
                .then(function (file) {
                    file.forEach(function (relativePath, entry) {
                        if (!entry.dir) {
                            INFO_LIST.forEach((item) => {
                                if (entry.name.search(item) > -1) {
                                    entry.async('nodebuffer').then(function (filecontent) {
                                        var dir = path.parse(entry.name).dir
                                        if (!fs.existsSync(dir)) {
                                            mkDirByPathSync(path.join(infoPath, dir))
                                        }
                                        fs.writeFileSync(path.join(infoPath, entry.name), filecontent)
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