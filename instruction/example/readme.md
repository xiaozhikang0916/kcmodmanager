# KCModManager

一款管理艦隊Collection(舰c)魔改mod的工具。

![ayanami](./readme/ayanami.png)

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
这个md文件可以使用相对路径引用同在根目录下的`readme`文件夹里的内容（主要是图片）。

`readme.md`的内容会被解析道到信息面板的底栏。

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