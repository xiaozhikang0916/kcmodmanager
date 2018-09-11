jszip = require("jszip")
fs = require("fs")
path = require("path")

function installMod(modName) {
    var zipName = modName + '.zip'
    extractZip(zipName, config.getExtractPath())
    saveInstallMod(modName)
}

function uninstallMod(modName) {
    var zipName = modName + '.zip'
    deleteFileFromZip(zipName, config.getExtractPath())
    deleteInstalledMod(modName)
}

function extractZip(zipFile, outputPath) {
    fs.readFile(path.join(config.getModPath(), zipFile), function (err, data) {
        if (err) {
            console.log("Read zip failed")
        }
        else {
            zip.loadAsync(data)
                .then(function (file) {
                    file.forEach(function (relativePath, entry) {
                        if (!entry.dir && !isInfoFile(relativePath)) {
                            entry.async('nodebuffer').then(function (filecontent) {
                                var dir = path.parse(entry.name).dir
                                if (!fs.existsSync(path.join(outputPath, dir))) {
                                    mkDirByPathSync(path.join(outputPath, dir))
                                }
                                fs.writeFileSync(config.formatFileName(entry.name, outputPath), filecontent)
                            })
                        }
                    })
                },
                    function (reason) {
                        console.log("read zip failed " + reason)
                    })
        }
    })
}

function deleteFileFromZip(zipFile, outputPath) {
    fs.readFile(path.join(config.getModPath(), zipFile), function (err, data) {
        if (err) {
            console.log("Read zip failed")
        }
        else {
            zip.loadAsync(data)
                .then(function (file) {
                    file.forEach(function (relativePath, entry) {
                        if (!entry.dir) {
                            let modFile = config.formatFileName(entry.name, outputPath)
                            fs.stat(modFile, function (err, stat) {
                                if (err) {
                                    return console.error(err);
                                }

                                fs.unlink(modFile, function (err) {
                                    if (err) return console.log(err);
                                });
                            })
                        }
                    })
                },
                    function (reason) {
                        console.log("read zip failed " + reason)
                    })
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