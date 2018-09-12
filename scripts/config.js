fs = require("fs")
path = require("path")
const app = require('electron')

class Config {
    constructor(datapath) {
        if (typeof datapath == 'string') {
            this.path = path.join(datapath, 'modconfig.json')
            this.loadConfig()
        } else {
            this.path = datapath.path
            if (datapath.name_format) {
                this.name_format = datapath.name_format
            } else {
                this.name_format = ''
            }
            if (datapath.extract_path) {
                this.extract_path = datapath.extract_path
            } else {
                this.extract_path = ''
            }
            if (datapath.mod_path) {
                this.mod_path = datapath.mod_path
            } else {
                this.mod_path = ''
            }
            if (datapath.installed_mod) {
                this.installed_mod = datapath.installed_mod
            } else {
                this.installed_mod = []
            }
        }
    }

    loadConfig() {
        console.log("Config read: path ")
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, "{}")
        }
        var tmp = JSON.parse(fs.readFileSync(this.path, 'utf8'))
        if (tmp.name_format) {
            this.name_format = tmp.name_format
        } else {
            this.name_format = ''
        }
        if (tmp.extract_path) {
            this.extract_path = tmp.extract_path
        } else {
            this.extract_path = ''
        }
        if (tmp.mod_path) {
            this.mod_path = tmp.mod_path
        } else {
            this.mod_path = ''
        }
        if (tmp.installed_mod) {
            this.installed_mod = tmp.installed_mod
        } else {
            this.installed_mod = []
        }
    }

    saveConfig() {
        if (!this.installed_mod) {
            this.installed_mod = []
        }
        fs.writeFileSync(this.path, JSON.stringify(this, null, 4), 'utf8')
    }

    validConfig() {
        return !(this.name_format === undefined || this.name_format == ''
            || this.extract_path === undefined || this.extract_path == ''
            || this.mod_path === undefined || this.mod_path == '')
    }

    getModPath() {
        return this.mod_path
    }

    setModPath(path) {
        this.mod_path = path
    }

    getNameFormat() {
        return this.name_format
    }

    setNameFormat(name) {
        this.name_format = name
    }

    getExtractPath() {
        return this.extract_path
    }

    setExtractPath(path) {
        this.extract_path = path
    }

    formatFileName(originName, relativePath = "") {
        var originPath = path.join(relativePath, originName)
        var name = path.basename(originPath)
        var extIndex = name.lastIndexOf('.')
        if (extIndex > 0) {
            var base = name.substring(0, extIndex)
            var ext = name.substring(extIndex + 1, name.length)

            var nname = this.getNameFormat().replace("\{name\}", base).replace("\{ext\}", ext)
            return path.join(originPath.substring(0, originPath.length - name.length), nname)
        } else {
            return originPath
        }
    }

    isModInstalled(modName) {
        let result = false
        this.installed_mod.forEach(function (item, index, array) {
            if (item == modName) {
                return result = true
            }
        })
        return result;
    }

    saveInstallMod(modName) {
        if (this.installed_mod === undefined) {
            this.installed_mod = []
        }
        this.installed_mod.forEach(function (item, index, array) {
            if (item == modName) {
                array.splice(index, 1)
            }
        })
        this.installed_mod.push(modName)
    }

    deleteInstalledMod(modName) {
        if (this.installed_mod === undefined) {
            return false;
        }
        let result = false
        this.installed_mod.forEach(function (item, index, array) {
            if (item == modName) {
                array.splice(index, 1)
                result = true
            }
        })
        return result;
    }
}

module.exports = Config