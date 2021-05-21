# Calibre 存储支持中文字符

[annotation]: [id] (50ac745c-ca13-46bc-9325-67574155bdbe)
[annotation]: [status] (public)
[annotation]: [create_time] (2021-05-21 14:49:45)
[annotation]: [category] (计算机技术)
[annotation]: [comments] (false)
[annotation]: [url] (http://blog.ccyg.studio/article/50ac745c-ca13-46bc-9325-67574155bdbe)


Calibre 无疑是管理书籍很强大的工具，无需赘言，但是存在一个问题，那就是存储的文件名如果是中文的话，会转换成对应的拼音。对于分享资料，特别的不方便，尽管不是决定性的，但是也很难受。好像已经有人提交 pr 了，但是无果，感觉是印度阿三的一点小倔强吧。

下面修改一下源码以支持中文路径，目前仅仅支持 5.2 一下版本。我用的是 5.1。

需要下载源码，在目录 `src/calibre/db/` 下找到文件 `backend.py`

然后修改 `ascii_filename` 函数，本来可以直接注掉，但是对于文件名中有路径不支持的字符就会有问题 比如斜杠和反斜杠。

去掉 `import` 的函数，在文件开头新建函数如下：

```python
def ascii_filename(filename):
    itab = r'<>:*"?\'
    otab = r'()_____'
    trans = str.maketrans(itab, otab)
    return filename.translate(trans)
```

然后替换掉 `pylib.zip` 中的 `backend.pyc`，我觉得可以不用编译成 `.pyo` 或者 `.pyc` 文件，毕竟 Calibre 无需多高的效率。

如果无法改动 `pylib.zip` 文件，可以先去掉文件的只读属性。

## frozen 文件

好像 Calibre 5.2 之后 `pylib.zip` 就不见了，换成了 `frozen` 文件，具体哪个版本我不清楚，但最新版确实没有。所以上面退而求其次，换到了 5.1。

# 参考资料

- <https://zhuanlan.zhihu.com/p/245553023>
