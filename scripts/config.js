fs = require("fs")
path = require("path")
const CONFIG_PATH = path.join(__dirname, "modconfig.json")
var MOD_CONFIG

function loadConfig() {
    console.log("Config read: path " + CONFIG_PATH)
    if (!fs.existsSync(CONFIG_PATH)) {
        fs.writeFileSync(CONFIG_PATH, "{}")
    }
    MOD_CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))

}

function saveConfig() {
    if (!MOD_CONFIG.installed_mod) {
        MOD_CONFIG.installed_mod = []
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(MOD_CONFIG, null, 4), 'utf8')
}

function validConfig() {
    loadConfig()
    return !(MOD_CONFIG.name_format === undefined || MOD_CONFIG.name_format == ''
        || MOD_CONFIG.extract_path === undefined || MOD_CONFIG.extract_path == ''
        || MOD_CONFIG.mod_path === undefined || MOD_CONFIG.mod_path == '')
}

function getModPath() {
    return MOD_CONFIG.mod_path
}

function setModPath(path) {
    MOD_CONFIG.mod_path = path
}

function getNameFormat() {
    return MOD_CONFIG.name_format
}

function setNameFormat(name) {
    MOD_CONFIG.name_format = name
}

function getExtractPath() {
    return MOD_CONFIG.extract_path
}

function setExtractPath(path) {
    MOD_CONFIG.extract_path = path
}

function formatFileName(originName, relativePath = "") {
    var originPath = path.join(relativePath, originName)
    var name = path.basename(originPath)
    var extIndex = name.lastIndexOf('.')
    if (extIndex > 0) {
        var base = name.substring(0, extIndex)
        var ext = name.substring(extIndex + 1, name.length)

        var nname = getNameFormat().replace("\{name\}", base).replace("\{ext\}", ext)
        return path.join(originPath.substring(0, originPath.length - name.length), nname)
    } else {
        return originPath
    }
}

function isModInstalled(modName) {
    let result = false
    MOD_CONFIG.installed_mod.forEach(function (item, index, array) {
        if (item == modName) {
            return result = true
        }
    })
    return result;
}

function saveInstallMod(modName) {
    if (MOD_CONFIG.installed_mod === undefined) {
        MOD_CONFIG.installed_mod = []
    }
    MOD_CONFIG.installed_mod.forEach(function (item, index, array) {
        if (item == modName) {
            MOD_CONFIG.installed_mod.splice(index, 1)
        }
    })
    MOD_CONFIG.installed_mod.push(modName)
    saveConfig()
}

function deleteInstalledMod(modName) {
    if (MOD_CONFIG.installed_mod === undefined) {
        return false;
    }
    let result = false
    MOD_CONFIG.installed_mod.forEach(function (item, index, array) {
        if (item == modName) {
            MOD_CONFIG.installed_mod.splice(index, 1)
            result = true
        }
    })
    saveConfig()
    return result;
}

loadConfig()