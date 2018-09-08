var modPath = document.getElementById('mod_path_edit')
var outputPath = document.getElementById('output_path_edit')
var nameFormat = document.getElementById('name_fmt_edit')

if (getModPath()) {
    modPath.value = getModPath()
}

if (getExtractPath()) {
    outputPath.value = getExtractPath()
}

if (getNameFormat()) {
    nameFormat.value = getNameFormat()
} else {
    nameFormat.value = "{name}.hack.{ext}"
    setNameFormat(nameFormat.value)
}

modPath.oninput = function(ev) {
    setModPath(modPath.value)
}

outputPath.oninput = function(ev) {
    setExtractPath(outputPath.value)
} 

nameFormat.oninput = function(ev) {
    setNameFormat(nameFormat.value)
}

window.onbeforeunload = function() {
    saveConfig()
}