zip = require('jszip')
fs = require('fs')
path = require('path')
var querystring = require("querystring");
const { ipcRenderer } = require('electron')
var content = document.getElementById("mod_list")
var mainPage = document.getElementById("mod_info")
const template = document.querySelector('template')
const pageNode = document.importNode(template.content, true)
const config = new Config(ipcRenderer.sendSync('get-setting'))

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
    /* TODO 
    read name from extracted info file
    but new it is an async function to extract zip file
    it would make ui flashing*/
    text.textContent = name
    element.appendChild(text)
    // element.appendChild(generateButton(name, installed))
    readModInfo(name, modFile)
    content.append(element)
}

function readModInfo(name, modFile) {
    function generatePage(result) {
        if (result) {
            let page = buildInfoPage(name, pageNode.cloneNode(true))
            mainPage.appendChild(page)
        }
    }
    const infoPath = path.join(config.getModPath(), ".modinfo", name)
    var fileCount = 0;
    var extractCount = 0;
    fs.readFile(modFile, function (err, data) {
        if (err) {
            console.log("Read zip failed")
        }
        else {
            zip.loadAsync(data)
                .then(function (file) {
                    file.forEach(function (relativePath, entry) {
                        if (!entry.dir) {
                            if (isInfoFile(relativePath)) {
                                fileCount += 1
                                var dir = path.parse(relativePath).dir
                                if (!fs.existsSync(dir)) {
                                    mkDirByPathSync(path.join(infoPath, dir))
                                }
                                entry.nodeStream()
                                    .pipe(fs.createWriteStream(path.join(infoPath, relativePath), 'utf8'))
                                    .on('finish', function () {
                                        extractCount += 1
                                        if (extractCount == fileCount) {
                                            generatePage(extractCount == fileCount)
                                        }
                                    })
                            }
                        }
                    })
                },
                    function (reason) {
                        console.log("read zip failed " + reason)
                    }
                ).then(() => {
                    if (fileCount == 0) {
                        generatePage(true)
                    }
                })
        }
    })
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
            if (file.endsWith(".zip")) {
                file = path.resolve(config.getModPath(), file)
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