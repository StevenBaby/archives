# coding=utf-8

import os
import re
from urllib import parse
import dandan

dirname = os.path.dirname(os.path.abspath(__file__))

markdown = '安装 ArchLinux 到U盘（四）安装Archlinux'

path = '../../计算机技术/Linux/安装 Archlinux 到U盘/{}.md'.format(markdown)

filename = os.path.abspath(os.path.join(dirname, path))

images = []

pattern = re.compile(r'\((https://upload-images.jianshu.io/.*)\)')

with open(filename, encoding='utf8') as file:
    content = file.read()

index = 1
for line in content.splitlines():
    match = pattern.search(line)
    if not match:
        continue
    image = match.group(1)
    url = 'http://pqs8hg59d.bkt.clouddn.com/{}-{}.png'.format(parse.quote(markdown), index)
    content = content.replace(line, '![{}]({})'.format(index, url))

    index += 1

with open(filename, mode='w', encoding='utf8') as file:
    file.write(content)

# for index, image in enumerate(images):
#     filename = os.path.join(dirname, '{}-{}.png'.format(markdown, index + 1))
#     dandan.traffic.download(image, filename)
