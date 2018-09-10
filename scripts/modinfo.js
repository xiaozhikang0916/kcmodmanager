function buildInfoPage(modName, template) {
    var modInfo = JSON.parse(fs.readFileSync(path.join(getModPath(), ".modinfo", modName, "info.json"), 'utf8'))
    var icon = template.querySelector(".icon")
    var title = template.querySelector(".title")
    var author = template.querySelector(".author")
    var tags = template.querySelector(".tags")
    var button = template.querySelector(".modbutton")
    icon.src = path.join(getModPath(), ".modinfo", modName, "icon")
    title.textContent = modInfo.name
    author.textContent = modInfo.author
    tags.textContent = modInfo.tags.join(',')
    generateButton(button, modName, false)
    template.id = `mod_info_${modName}`
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