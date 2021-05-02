# 一些 Gnome 配置方法

[annotation]: [id] (5c153b7a-3c51-4e0a-b846-22a77714b3d3)
[annotation]: [status] (public)
[annotation]: [create_time] (2021-05-02 12:59:28)
[annotation]: [category] (计算机技术)
[annotation]: [tags] (Linux|Gnome)
[annotation]: [comments] (false)
[annotation]: [url] (http://blog.ccyg.studio/article/5c153b7a-3c51-4e0a-b846-22a77714b3d3)

## 手动安装扩展

由于 Gnome 更新，某些 Extension 没有来得及更新，这时候，需要扩展的话，就比较麻烦。

一种方法是下载旧版的 Extension，然后手动改一下支持的版本号，然后手动安装。

下载和改版本号就不说了，具体修改可以参考一个可以安装的扩展，我不相信 Gnome 更新之后所有的扩展都不能用了。

Gnome 扩展的安装位置如下：

```text
~/.local/share/gnome-shell/extensions/
```

然后找到扩展的 `uuid`，这个值在 `metadata.json` 里

最后整个目录结构如下：

- `~/.local/share/gnome-shell/extensions/<uuid>`
    - `~/.local/share/gnome-shell/extensions/<uuid>/metadata.json`
        需要在这个文件中修改版本号
    - `~/.local/share/gnome-shell/extensions/<uuid>/extension.js`

修改好之后，重新启动 Gnome Shell

按下 `ALT` + `F2`，然后输入 R，然后 `Enter`

---

## 参考资料

1. <https://askubuntu.com/questions/196884/how-to-install-gnome-shell-extensions-offline>