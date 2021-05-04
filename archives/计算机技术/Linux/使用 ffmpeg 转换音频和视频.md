# 使用 ffmpeg 转换音频和视频

[annotation]: <id> (921e4689-816b-4c99-8248-b149827cb077)
[annotation]: <status> (public)
[annotation]: <create_time> (2019-05-03 11:09:35)
[annotation]: <category> (计算机技术)
[annotation]: <comments> (false)


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

## 截取视频

```sh
ffmpeg  -i input.mp4 -c copy -ss 00:00:10 -to 00:00:15 output.mp4 -y
```

其中 **00:00:10** 和 **00:00:15** 分别为视频开始时间和结束时间。


## 截取视频中某个区域

```sh
ffmpeg -i input.mp4 -vf crop=400:400 output.mp4 -y
ffmpeg -i input.mp4 -vf crop=400:400:0:0 output.mp4 -y
```

crop的参数格式为 `crop=w:h:x:y`，其中：

- `w:h` 为输出视频的宽和高
- `x:y` 标记输入视频中的某点，将该点作为基准点，向右下进行裁剪得到输出视频
- 如果x y不写的话，默认居中剪切

## 合并视频

```sh
ffmpeg -i 1.mp4 -i 2.mp4 -filter_complex "[0:v] [0:a] [1:v] [1:a] concat=n=2:v=1:a=1 [v] [a]" -map "[v]" -map "[a]"  -c copy output.mp4
```