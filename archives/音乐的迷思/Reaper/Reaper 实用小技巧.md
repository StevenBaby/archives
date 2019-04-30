# Reaper 实用小技巧

[annotation]: <id> (9532ad58-b71e-4dda-b980-c3ca0a76b9e2)
[annotation]: <category> (音乐的迷思)
[annotation]: <tags> (音乐制作|Reaper)
[annotation]: <status> (public)
[annotation]: <create_time> (2018-08-18 23:59:22)
[annotation]: <comments> (true) 

## 以鼠标位置水平缩放 <sub><small>[2018-08-18]</small></sub>

默认的缩放设置是以时间游标为中心缩放的，而大多数的音频工作站是以鼠标为中心水平缩放的，所以养成了一些很难改的习惯，于是在 reaper 中使用起来感觉很生涩，但是强大的 reaper 可以兼容这一点。

点击菜单 `Options` > `Preferences` 或者按下快捷键 `CTRL + P` 打开偏好设置。

左侧选择 `Editing Behavior` 在 `Horizontal zoom center` 选项中选择 **`Mouse cursor`**，就可以了。

## 虚拟MIDI键盘 <sub><small>[2018-08-19]</small></sub>

选择菜单 `View` > `Virtual MIDI Keyboard` 或者按下快捷键 `ALT + B` 即可显示虚拟MIDI键盘。

## 检测歌曲速度 <sub><small>[2018-08-27]</small></sub>

默认情况下，reaper 的时间基于节拍，这时候如果修改歌曲的节奏，条目的速度将被拉伸。

如果将时间基础改为时间而非节拍，这样修改歌曲节奏速度的时候，条目将不会被拉伸。同样，可以修改音轨的时间基础。

点击 `CTRL + J` 可以打开跳转时间线的对话框。跳转到某个小节线上，然后点击鼠标右键，选择 `Insert tempo/time signature marker...` 或者选择快捷键 `SHIFT + C` 来插入时间标记。然后按住 `CTRL` 键拖动标记，就会同时修改歌曲节奏。然后删除时间标记，节奏就好了。

**做该操作之前请先确定节拍是否正确** 

## 参考资料

1. <https://forum.cockos.com/showthread.php?t=78638>
2. [Finding the Song Tempo in REAPER](https://www.youtube.com/watch?v=bkqztQsoMNU)