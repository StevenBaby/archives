# 测试页面

[annotation]: <id> (9034ba44-2ccf-46f7-8951-3f8a32bf522c)
[annotation]: <status> (public)
[annotation]: <comments> (true)

这是一个博客测试页面，并无实际价值。

## 测试表格

| 左对齐标题 | 右对齐标题 | 居中对齐标题 |
| :------| ------: | :------: |
| 短文本 | 中等文本 | 稍微长一点的文本 |
| 稍微长一点的文本 | 短文本 | 中等文本 |

## 测试列表

* 测试列表 *
* [ ] 未选列表 *
* [X] 已选列表 *
+ 测试列表 +
+ [ ] 未选列表 +
+ [X] 已选列表 +
- 测试列表 -
- [ ] 未选列表 -
- [X] 已选列表 -
    - 测试子列表
    - [ ] 未选子列表
    - [X] 已选子列表

1. 测试有序列表
2. [ ] 未选有序列表
3. [X] 已选有序列表

## 测试代码

这里测试行内代码 `CTRL + SHIFT + ALT + Delete`

下面是块级别代码

```c++
#include <iostream>
int main()
{
    std::cout << "hello world" << std::endl;
    return 0;
}
```

## 测试引用

> 时间没有等我 是你 忘了带走我 我左手是过目不忘的萤火 右手是十年一个漫长的打坐 命运没有留我 是我 遗弃自己在角落 我左边空想翻腾的生活 右边跌落五年一瞬短暂的因果


## 测试删除线

~~时光在静静的流淌，离开了家乡，追逐的梦到了远方，却始终捉不住月亮。~~

## 测试图片重定向

![](static/test-001.png)


## 测试svg重定向

<img src='static/test-002.svg?sanitize=true' width=150 height=150/>


## 测试 ALT

<sup class='ui pop'><small>[1]</small></sup>
<span class="ui popup">This is a super link</span>

<i class="ui pop heart circular small pink icon"></i>
<span class="ui popup">This is a heart</span>

## 测试基本公式

$$\int_{\partial\Omega} \omega = \int_\Omega d\omega$$

$$\begin{cases}
\sqrt{a^2 - x^2}  \Rightarrow x = a\sin t\\
\sqrt{a^2 + x^2}  \Rightarrow x = a\tan t\\
\sqrt{x^2 - a^2}  \Rightarrow x = a\sec t\\
\end{cases}$$

## 测试 mermaid

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

## 测试 GeoGebra

<iframe src="https://www.geogebra.org/calculator/vasdtgww?embed" class="video" width="640" height="360"></iframe>


## 测试 Jplayer 播放器 音频

<div class='ui jplayer audio' data-url="https://link.hhtjim.com/kw/1027785.mp3" format='mp3' title="梁静茹 - 情歌"></div>


## 测试 Jplayer 播放器 视频

<div class='ui jplayer video' data-url="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" data-placeholder="https://media.w3.org/2010/05/bunny/poster.png" format='webmv'></div>


## 测试网易云音乐

<iframe class='row' frameborder="no" border="0" marginwidth="0" marginheight="0" width=300 height=86 src="http://music.163.com/outchain/player?type=2&id=516719755&height=66"></iframe>

## 测试优酷视频

<iframe class="video" width="640" height="360" src="http://player.youku.com/embed/XMTM2MjE4MzU3Ng=="></iframe>


## 测试哔哩哔哩视频

<iframe class="video" width="640" height="360" src="//player.bilibili.com/player.html?aid=66928370&cid=116061321&page=1"></iframe>
