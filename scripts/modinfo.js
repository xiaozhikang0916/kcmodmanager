function buildInfoPage(modName, template) {
    var icon = template.querySelector(".icon")
    var title = template.querySelector(".title")
    var author = template.querySelector(".author")
    var tags = template.querySelector(".tags")
    var button = template.querySelector(".modbutton")
    if (fs.existsSync(path.join(getModPath(), ".modinfo", modName, "info.json"))) {
        var modInfo = JSON.parse(fs.readFileSync(path.join(getModPath(), ".modinfo", modName, "info.json"), 'utf8'))
        icon.src = path.join(getModPath(), ".modinfo", modName, "icon.png")
        title.textContent = modInfo.name
        author.textContent = modInfo.author
        tags.textContent = modInfo.tags.join(',')
    } else {
        title.textContent = modName
    }
    generateButton(button, modName, false)
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