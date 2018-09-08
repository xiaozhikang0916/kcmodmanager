# KCModManager

A tool to manage Mods package of 艦隊Collection(Kancolle)

It is only to manage you mod files, does not provide local-cache feature of the game.

[中文简介](./README-ch.md)

## Build

Developed in [Electron](https://electronjs.org/) 2.0.8

To build by yourself, run :

```bash
git clone git@github.com:xiaozhikang0916/kcmodmanager.git

cd kcmodmanager

//Node.js and npm are required

npm install

npm start
```

## How to use

Package your mod files in zip following:

* Keep the architacture of what it is in cache
* Directory `kcs2` should be in the root of you zip
* Keep the original name of modified resource file

It should look like:

```
your_mod.zip
    |
    --kcs2
        |
        --img
            |
            -- ...
            |
            -- modified_file.png
```

Open this app, complete the setting window if it is first time to start.

* Path to your mod zip files
* Path to your local game cache
> `kcs2` should located in the root of your local game cache
* Output format of resource files
> Use placeholder `{name}` and `{ext}`, default is `{name}.hack.{ext}`. Try **NOT** to use `{name}.{ext}` since it would overwrite the origin cache file.

Close setting window to save.

## LICENCE

Under licence [MIT](./LICENCE)