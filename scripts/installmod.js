fs = require("fs")
path = require("path")

function installMod(modName) {
    var outputPath = config.getExtractPath()
    walkDir(path.join(config.getModPath(), modName), function (err, result) {
        if (err) {
            console.err(`Fail to install ${modName} : ${err}`)
        } else {
            var conflicts = checkFileConflict(result, outputPath)
            if (conflicts && conflicts.length > 0) {
                notifyConflict(conflicts)
            }
            result.forEach((file) => {
                if (!isInfoFile(file)) {
                    var rPath = path.relative(file, path.join(config.getModPath(), modName))
                    rPath = path.join(file, rPath)
                    rPath = file.substring(rPath.length, file.length)
                    var dir = path.parse(rPath).dir
                    if (!fs.existsSync(path.join(outputPath, dir))) {
                        mkDirByPathSync(path.join(outputPath, dir))
                    }
                    fs.copyFileSync(path.join(config.getModPath(), modName, rPath), config.formatFileName(rPath, outputPath))
                }
            })
            config.saveInstallMod(modName)
            ipcRenderer.sendSync("save-setting", config)
        }
    })
}

function uninstallMod(modName) {
    var outputPath = config.getExtractPath()
    walkDir(path.join(config.getModPath(), modName), function (err, result) {
        if (err) {
            console.err(`Fail to uninstall ${modName} : ${err}`)
        } else {
            result.forEach((file) => {
                if (!isInfoFile(file)) {
                    var rPath = path.relative(file, path.join(config.getModPath(), modName))
                    rPath = path.join(file, rPath)
                    rPath = file.substring(rPath.length, file.length)
                    fs.unlink(config.formatFileName(rPath, outputPath))
                }
            })
            config.deleteInstalledMod(modName)
            ipcRenderer.sendSync("save-setting", config)
        }
    })
}

function mkDirByPathSync(targetDir, { isRelativeToScript = true } = {}) {
    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = isRelativeToScript ? __dirname : '.';

    return targetDir.split(sep).reduce((parentDir, childDir) => {
        const curDir = path.resolve(baseDir, parentDir, childDir);
        try {
            fs.mkdirSync(curDir);
        } catch (err) {
            if (err.code === 'EEXIST') { // curDir already exists!
                return curDir;
            }

            // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
            if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
                throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
            }

            const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
            if (!caughtErr || caughtErr && targetDir === curDir) {
                throw err; // Throw if it's just the last created dir.
            }
        }

        return curDir;
    }, initDir);
}

function walkDir(dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function (file) {
            file = path.resolve(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walkDir(file, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
}

function checkFileConflict(fileList, outputPath) {
    var results = [];
    fileList.forEach((file) => {
        if (fs.existsSync(config.formatFileName(file, outputPath))) {
            results.push(file)
        }
    })
    return results
}

function notifyConflict(conflicts) {
    console.error("Files from mod are overwriting existing mod resources!:")
    conflicts.forEach((file) => {
        console.error(file)
    })
}

window.onbeforeunload = function () {
    ipcRenderer.sendSync("save-setting", config)
}