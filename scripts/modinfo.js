const marked = require('marked')

const INFO_LIST = [
    /readme\.md/,
    /info\.json/,
    /icon\.*/,
    /readme[\\\/]/,
    /\.DS_Store/
]

function buildInfoPage(modName, template) {
    const infoJsonPath = path.join(config.getModPath(), modName, "info.json")
    const iconPath = path.join(config.getModPath(), modName, "icon.png")
    const readmePath = path.join(config.getModPath(), modName, "readme.md")
    var icon = template.querySelector(".icon")
    var title = template.querySelector(".title")
    var author = template.querySelector(".author")
    var tags = template.querySelector(".tags")
    var button = template.querySelector(".modbutton")
    if (fs.existsSync(infoJsonPath)) {
        var modInfo = JSON.parse(fs.readFileSync(infoJsonPath, 'utf8'))
        icon.style.display = "block"
        icon.src = iconPath
        title.textContent = modInfo.name
        author.textContent = modInfo.author
        tags.textContent = modInfo.tags.join(',')
        template.querySelector(".readme_section").innerHTML = marked.parse(
            fs.readFileSync(readmePath, 'utf8'),
            {
                baseUrl: path.join(config.getModPath(), modName, './'),
                gfm: true
            }
        )
    } else {
        title.textContent = modName
        icon.style.display = "none"
    }
    generateButton(button, modName, config.isModInstalled(modName))
    template.firstElementChild.id = `mod_info_${modName}`
    return template
}

function generateButton(element, modfile, installed) {
    if (installed) {
        element.classList.add("installed")
    }
    else {
        element.classList.remove("installed")
    }
    element.id = `mod_button_${modfile}`
    element.addEventListener("click", function (e, ev) {
        element.disabled = true
        if (config.isModInstalled(modfile)) {
            uninstallMod(modfile)
        } else {
            installMod(modfile)
        }
    })
    return element
}

function notifyInstalled(modName, result) {
    if (result) {
        element.classList.add("installed")
    }
    notifyButton(modName, result)
}

function notifyUninstalled(modName, result) {
    if (result) {
        element.classList.remove("installed")
    }
    notifyButton(modName, result)
}

function notifyButton(modName, result) {
    document.getElementById(`mod_button_${modName}`).disabled = false
}

function isInfoFile(file) {
    if (file.startsWith("kcs2")) {
        return false
    } else {
        return INFO_LIST.some((name) => {
            return file.search(name) > -1
        })
    }
}