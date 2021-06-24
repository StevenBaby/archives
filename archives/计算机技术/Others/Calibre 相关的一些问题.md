# Calibre 相关的一些问题

[annotation]: [id] (50ac745c-ca13-46bc-9325-67574155bdbe)
[annotation]: [status] (public)
[annotation]: [create_time] (2021-05-21 14:49:45)
[annotation]: [category] (计算机技术)
[annotation]: [comments] (false)
[annotation]: [url] (http://blog.ccyg.studio/article/50ac745c-ca13-46bc-9325-67574155bdbe)

## 豆瓣插件的问题

由于豆瓣封掉了 api 接口，所以不能直接使用豆瓣插件了，但是我们还是可以直接从网页爬下相关得信息，只需要知道豆瓣 id，或者书的 isbn 就可以。

以下是相关的

<https://github.com/StevenBaby/tools/tree/master/calibre>

需要下载 `Douban Book.zip` 文件，然后在 Calibre 中：

**首选项** --> **插件** --> **搜索豆瓣**

然后，删除原有豆瓣插件，然后从文件加载插件，找到下载好的文件。然后重新启动，就安装好了。

然后，选择编辑元数据，需要在 ids 栏中输入豆瓣 id，比如 `douban:3029210`，或者 `isbn:9787300088907`，点击下载元数据即可。上面这本书是《许三观卖血记》，仅作一例。

豆瓣 id 在 图书页的 URL 中，isbn 在图书页的详情中，需要首先得到这两个值的其中任何一个，有限选择 douban id，不过有些书默认会带有 isbn，就不需要查找了。

---

## 本地存储支持中文字符

Calibre 无疑是管理书籍很强大的工具，无需赘言，但是存在一个问题，那就是存储的文件名如果是中文的话，会转换成对应的拼音。对于分享资料，特别的不方便，尽管不是决定性的，但是也很难受。好像已经有人提交 pr 了，但是无果，感觉是印度阿三的一点小倔强吧。

下面修改一下源码以支持中文路径，目前仅仅支持 5.2 一下版本。我用的是 5.1。

需要下载源码，在目录 `src/calibre/db/` 下找到文件 `backend.py`

然后修改 `ascii_filename` 函数，本来可以直接注掉，但是对于文件名中有路径不支持的字符就会有问题 比如斜杠和反斜杠。

去掉 `import` 的函数，在文件开头新建函数如下：

```python
def ascii_filename(filename):
    itab = r'\/:*?"<>|'
    otab = r'______()_'
    trans = str.maketrans(itab, otab)
    return filename.translate(trans)
```

然后替换掉 `pylib.zip` 中的 `backend.pyc`，我觉得可以不用编译成 `.pyo` 或者 `.pyc` 文件，毕竟 Calibre 无需多高的效率。

如果无法改动 `pylib.zip` 文件，可以先去掉文件的只读属性。

### frozen 文件

好像 Calibre 5.2 之后 `pylib.zip` 就不见了，换成了 `frozen` 文件，具体哪个版本我不清楚，但最新版确实没有。所以上面退而求其次，换到了 5.1。

# 参考资料

- <https://zhuanlan.zhihu.com/p/245553023>
