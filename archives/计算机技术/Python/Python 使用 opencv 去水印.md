# Python 使用 opencv 去水印

[annotation]: [id] (ab7288ac-7a2c-4380-80aa-d82a102ca733)
[annotation]: [status] (public)
[annotation]: [create_time] (2021-09-12 21:52:46)
[annotation]: [category] (计算机技术)
[annotation]: [tags] (Python|OpenCV)
[annotation]: [comments] (true)
[annotation]: [url] (http://blog.ccyg.studio/article/ab7288ac-7a2c-4380-80aa-d82a102ca733)

处理的方式及其简单，就是图像中有模式固定但是位置不固定的水印，而且背景颜色单一，这样就可以使用如下代码去之；

代码如下，其中：

- `template` 是图像中水印位置的截图
- `rectangle` 中的参数 `(255, 255, 255)` 是背景颜色，此处是白色

```python
# coding=utf-8
import os
import glob

import cv2
import numpy as np

dirname = os.path.dirname(__file__)
os.chdir(dirname)

def remove_template(filename, template):
    image = cv2.imread(filename, 1)
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)

    w, h = template.shape[::-1]

    res = cv2.matchTemplate(gray, template, cv2.TM_CCOEFF_NORMED)

    threshold = 0.9
    loc = np.where(res >= threshold)

    left = 0
    right = 1
    count = 0

    while True:
        threshold = (left + right) / 2
        count += 1

        loc = np.where(res >= threshold)
        if len(loc[0]) > 1:
            left = threshold
            continue
        if len(loc[0]) < 1:
            right = threshold
            continue
        pt = loc[::-1]
        break

    topleft = (pt[0][0], pt[1][0])
    bottomright = (pt[0][0] + w - 1, pt[1][0] + h - 1)

    cv2.rectangle(image, topleft, bottomright, (255, 255, 255), -1)
    return image


def main():
    template = cv2.imread('template.jpg', 0)
    files = glob.glob(os.path.join(dirname, 'input/*.jpg'))
    for filename in files:
        basename = os.path.basename(filename)
        outputfile = os.path.join(dirname, f'output/{basename}')

        image = remove_template(filename, template)
        cv2.imwrite(outputfile, image)
        print('write', outputfile)


if __name__ == '__main__':
    main()
```