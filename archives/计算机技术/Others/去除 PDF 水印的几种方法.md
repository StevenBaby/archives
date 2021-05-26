# 去除 PDF 水印的几种方法

[annotation]: [id] (459c375e-788a-4bc5-9c1f-349c5e1b42de)
[annotation]: [status] (public)
[annotation]: [create_time] (2021-05-26 17:20:33)
[annotation]: [category] (计算机技术)
[annotation]: [comments] (true)
[annotation]: [url] (http://blog.ccyg.studio/article/459c375e-788a-4bc5-9c1f-349c5e1b42de)


如题所知，这么干可能不太人道，但是有时候有些水印真的是特别讨厌，遂去之。

不同的 PDF 文件可能由不同的方式生成，那么为了更好的保留 pdf 本来的样子，那么去除水印的方法也不尽相同。

首先，需要安装 Python 包 `pymupdf`

    pip install pymupdf

---

## 扫描版 PDF

这个 PDF 应该改是最常见的，可以认为 pdf 是一堆图片的组合，如果水印和图片是分离的，那么就可以使用这种方式，对于水印嵌在图片中的 pdf，目前还无能为力。

这种方式，可以将 pdf 中的图片提取成没有水印的图片，然后，自己手动再有图片合成新的 pdf。

具体的代码如下：

```python
# coding=utf-8

import os
import sys
import fitz

dirname = os.path.dirname(__file__)

if not os.path.exists("output"):
    os.makedirs('output')

doc = fitz.open('input.pdf')

for nr in range(len(doc)):
    images = doc.getPageImageList(nr)
    if not images:
        continue

    maxsize = 0
    image = None
    for var in images:
        size = var[2] * var[3]
        if maxsize < size:
            image = var
            maxsize = size

    xref = image[0]

    pix = fitz.Pixmap(doc, xref)
    name = f"output/{nr}.png"
    if pix.n < 5:       # this is GRAY or RGB
        pix.writePNG(name)
    else:               # CMYK: convert to RGB first
        pix1 = fitz.Pixmap(fitz.csRGB, pix)
        pix1.writePNG(name)
    print(name, pix)
```

最终会将当前目录 input.pdf 文件的图片分离到，output 目录中。自己手动合成新的 pdf 即可。

---

## 可写成 svg 的 pdf

有些水印看起来像一个背景图片，但实际上不是图片，而十由众多曲线绘制而成的。这种情况下，可以将整个页面保存成 svg，然后编辑 svg，因为在 svg 中提取水印特征还是很简单的，这里就不说了。将 svg 中的水印删除之后重新合成即可。

不过这种方式有个缺点，就是文字信息都丢了，尽管可以重新 OCR，但是总归有缺陷。

具体代码如下：

```py
# coding=utf-8

import os
import sys
import fitz

dirname = os.path.dirname(__file__)
os.chdir(dirname)

if not os.path.exists("output"):
    os.makedirs('output')

doc = fitz.Document('input.pdf')

for nr in range(len(doc)):
    # doc._deleteObject()
    name = f'output/{nr}.svg'
    image = doc[nr].get_svg_image()
    with open(name, 'w') as file:
        file.write(image)
    print(name)
```

---

## 水印是文字可复制的 pdf

这种水印也是很常见的，处理方式简单，找到相关的文字，然后隐藏之。

代码如下：

```py
# coding=utf-8

import os
import sys

import fitz

dirname = os.path.dirname(__file__)
os.chdir(dirname)

doc = fitz.Document('input.pdf')

for page in doc:
    print(page)
    rects = page.searchFor("水印的文字")
    for rect in rects:
        page.addRedactAnnot(rect)
        print(rect)
    page.apply_redactions()

doc.save('output.pdf')
```

这样处理完，尽管水印没了，但是文件体积会变大，一种方法是利用 Acrobat 重新打印该文件为 pdf，这样会更好一点。
