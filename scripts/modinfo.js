const marked = require('marked')

const INFO_LIST = [
    /readme\.md/,
    /info\.json/,
    /icon\.*/,
    /readme\//
]

function buildInfoPage(modName, template) {
    var icon = template.querySelector(".icon")
    var title = template.querySelector(".title")
    var author = template.querySelector(".author")
    var tags = template.querySelector(".tags")
    var button = template.querySelector(".modbutton")
    if (fs.existsSync(path.join(getModPath(), ".modinfo", modName, "info.json"))) {
        var modInfo = JSON.parse(fs.readFileSync(path.join(getModPath(), ".modinfo", modName, "info.json"), 'utf8'))
        icon.style.display = "block"
        icon.src = path.join(getModPath(), ".modinfo", modName, "icon.png")
        title.textContent = modInfo.name
        author.textContent = modInfo.author
        tags.textContent = modInfo.tags.join(',')
        template.querySelector(".readme_section").innerHTML = marked.parse(
            fs.readFileSync(path.join(getModPath(), ".modinfo", modName, "readme.md"), 'utf8'),
            {
                baseUrl: path.join(getModPath(), ".modinfo", modName, './'),
                gfm: true
            }
        )
    } else {
        title.textContent = modName
        icon.style.display = "none"
    }
    generateButton(button, modName, isModInstalled(modName))
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

function isInfoFile(file) {
    if (file.startsWith("kcs2")) {
        return false
    } else {
        return INFO_LIST.some((name) => {
            return file.search(name) > -1
        })
    }
}