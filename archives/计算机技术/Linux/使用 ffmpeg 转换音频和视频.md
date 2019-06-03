# 使用 ffmpeg 转换音频和视频

[annotation]: <id> (921e4689-816b-4c99-8248-b149827cb077)
[annotation]: <status> (public)
[annotation]: <create_time> (2019-05-03 11:09:35)
[annotation]: <category> (计算机技术)
[annotation]: <comments> (false)

> 原文链接：<http://blog.ccyg.studio/article/921e4689-816b-4c99-8248-b149827cb077>

---

## 将 mp3 转换为 wav

```sh
ffmpeg -i input.mp3 output.wav
```

---

## 将视频旋转 90 度 

```sh
ffmpeg -i input.mp4 -vf "transpose=1" out.mov output.mp4
```

可选参数：

- 0 = 90CounterCLockwise and Vertical Flip (default)
- 1 = 90Clockwise
- 2 = 90CounterClockwise
- 3 = 90Clockwise and Vertical Flip

---
