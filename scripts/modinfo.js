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
    element.addEventListener("click", function (e, ev) {
        if (config.isModInstalled(modfile)) {
            uninstallMod(modfile)
            element.classList.remove("installed")
        } else {
            installMod(modfile)
            element.classList.add("installed")
        }
    })
    return element
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