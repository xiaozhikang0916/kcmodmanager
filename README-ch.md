# KCModManager

[![Build Status](https://travis-ci.org/xiaozhikang0916/kcmodmanager.svg?branch=master)](https://travis-ci.org/xiaozhikang0916/kcmodmanager)
[![Build status](https://ci.appveyor.com/api/projects/status/g9nf98ljeai65vgf/branch/master?svg=true)](https://ci.appveyor.com/project/xiaozhikang0916/kcmodmanager/branch/master)

一款管理艦隊Collection(舰c)魔改mod的工具。

此工具仅用于管理mod文件，不包含本地缓存功能。

[English Readme](./README.md)

![screenshot](./instruction/screenshot.png)
## 编译

基于 [Electron](https://electronjs.org/) 2.0.8 开发

运行以下命令来自行编译 :

```bash
git clone git@github.com:xiaozhikang0916/kcmodmanager.git

cd kcmodmanager

//需要先行安装好Node.js 和 npm

npm install

npm start
```

## 组织你的zip文件

将你的魔改mod文件按以下规则打包成zip:

* 保持在原缓存里的文件结构
* `kcs2`文件夹应该位于zip文件的根目录下
* 需要替换的资源文件要保持其原名

你也可以添加一些描述文件，app会解析这些文件并且展示：

* 图标 `icon.png`，将以`80px*80px`的尺寸展现
* 基本信息 `info.json`，其内容为：
  * 标题 `title`: string
  * 作者 `author`: string
  * 标签 `tags`: list of strings

一个合法的 `info.json` 文件长这样：

```json
{
    "name": "A KanColle Mod",
    "author": "KCModManager",
    "tags": [
        "mod",
        "KanColle",
        "Tanaka"
    ]
}
```

以上两个文件的内容会被解析到信息面板的顶栏。

除此以外，你还可以添加一个`readme.md`文件到你的zip根目录下。
这个md文件可以使用相对路径引用同在根目录下的`readme`文件夹里的内容（主要是图片）。

`readme.md`的内容会被解析到信息面板的底栏。

Zip文件的结构应该长这样:

```
your_mod.zip
    |
    - icon.png
    |
    - info.json
    |
    - readme.md
    |
    - readme
    |   |
    |   - screenshot.png
    |
    -- kcs2
        |
        -- img
            |
            -- ...
            |
            -- modified_file.png
```
你可以在[./instruction/example.zip](./instruction/example.zip)找到一个示例zip包。

## 如何使用

运行程序，如果你是第一次打开此程序，需要先完成设置选项

* 存放你的mod包的路径
* 存放你的本地缓存的路径
> 文件夹`kcs2`应该位于你的本地缓存路径的根目录下
* 输出的资源文件的格式
> 使用占位符 `{name}` 和 `{ext}` 指代原名、扩展名, 默认是 `{name}.hack.{ext}`。尽量**不要**使用`{name}.{ext}`，这会覆盖你原本的本地缓存资源

关闭设置窗口即可保存设置。

点击安装、卸载即可管理你的mod包。

## 计划中

* 将每个mod包修改的文件列表存入配置文件中
  * 处理多个mod修改同一个文件的情况
* 支持读取zip包里的`readme`文件，展示mod包的介绍信息
* UI改进

## 开源协议

使用[MIT协议](./LICENCE)
