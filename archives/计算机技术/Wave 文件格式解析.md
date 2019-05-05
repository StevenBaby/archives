# Wave 文件格式解析

[annotation]: <id> (593eaa9a-7457-4561-ad97-7fabacb6c05d)
[annotation]: <status> (public)
[annotation]: <create_time> (2019-05-04 00:26:39)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (音频处理)
[annotation]: <comments> (false)

> 原文链接：<http://blog.ccyg.studio/article/593eaa9a-7457-4561-ad97-7fabacb6c05d>

---

## 基本概念

关于音频文件，有几个基础的概念需要说明一下：

**位数** 音频量化位数，采样的精度。与位图的位数相对，一般的8位位图，总共有 0~255 个灰度值，RGB色彩格式表示了 RGB这三种颜色，各个颜色的颜色深度。而音频是录音设备在特定的时刻记录当时空气的张力值，可以这么理解吧。16位深度的录音设备可以保存的范围是 0~65535，所以声音震动产生的张力总会被量化到这个范围中，准确性会因为量化而有所损失。

**采样率** 音频的最高频率，通常为 41000 Hz，或者 48000 Hz，人耳能听到的频率为 20 ~ 20000 Hz，而成年人一般只能听到 30 ~ 15000 Hz 所以 41000 Hz 的音频完全可以满足人耳的需要。采样率表示了，录音设备每秒采集数据的次数，也就是bit 位数，每秒采集相应次数的数值，用来记录一秒内声音张力的变化。

**声道** 声轨的数量，一般位为单声道或者立体声

**码率** 每秒播放的字节数，可以估计出缓冲区大小，也就是 位数 * 采样率

## wave 格式简介

wave 是微软和IBM定义的PC机存储音频文件的标准，它使用 Resource Interchange File Format RIFF 来存储信息。

## wave 文件头解析

![wav-sound-format.gif](http://pqs8hg59d.bkt.clouddn.com/wav-sound-format.gif)

如图所示，wave文件头包含以下信息：

| 属性 | 长度（字节） | 解释 |
|:-:|:-:|:-:|
| ChunkID | 4 | ASCII 表示的 RIFF (0x52494646) |
| ChunkSize | 4 | 32 + Subchunk2Size  |
| Format | 4 | ASCII 表示的 WAVE (0x57415645) |
| Subchunk1ID | 4 | 新的数据块（格式信息说明块）ASCII码表示的 fmt (0x666d7420)，最后一个是空格 |
| Subchunk1Size | 4 | 本块数据的大小，(对于PCM, 值为16) |
| AudioFormat | 2 | PCM = 1 |
| NumChannels | 2 | 声道数 1 = 单声道，2 = 立体声 |
| SampleRate | 4 | 采样率 |
| ByteRate | 4 | 码率 SampleRate * NumChannels * BitsPerSample / 8 |
| BlockAlign | 2 | NumChannels * BitsPersample |
| BitsPerSample | 2 | 采样位数 |
| Subchunk2ID | 4 | 新数据块，真正的声音数据，ASCII 码表示的 data (0x64617461) |
| Subchunk2Size | 4 | 数据大小，即后面 data 的大小 |
| data | Subchunk2Size | 实际音频数据 |

如图和表格所示：

ChunkID，ChunkSize，Format 共同表示了这个文件是 WAVE 文件它由两部分组成，格式块(fmt)和数据块(data)

Subchunk1ID，Subchunk1Size，AudioFormat，NumChannels，SampleRate，ByteRate，BlockAlign，BitsPerSample 是格式块的属性，共同决定了音频文件的格式信息

Subchunk2ID，Subchunk2Size，data 就是实际的数据了

## wave 数据解析

下面是一个 72 字节的 wave 文件的解析，该文件采用PCM编码，音频双声道，每个样点进行16位量化编码，一个样点占4个字节，左右声道交替存储。

```binary
52 49 46 46 24 08 00 00 57 41 56 45 66 6d 74 20 10 00 00 00 01 00 02 00 
22 56 00 00 88 58 01 00 04 00 10 00 64 61 74 61 00 08 00 00 00 00 00 00 
24 17 1e f3 3c 13 3c 14 16 f9 18 f9 34 e7 23 a6 3c f2 24 f2 11 ce 1a 0d 
```

![](http://pqs8hg59d.bkt.clouddn.com/wave-bytes.gif)

wave文件默认的字节序是小端存储的，如果文件使用大端存储，则需要使用 RIFX 替换 RIFF。

再看数据格式，由于编码为位数为16，所以每个数据有两个字节组成，前两个字节为左声道，后两个字节为右声道。

这里的值是以short形式存储的，也就是 从 -32768 ~ 32767 直接的数。

## 解析程序

代码如下:

```python
# coding=utf-8

import os
import struct
from io import BytesIO

import pyaudio


class RIFFChunk(object):

    RIFF = "RIFF"
    FORMAT = "WAVE"
    STRUCT = '4sI4s'

    def __init__(self, file):
        data = file.read(12)
        res = struct.unpack(self.STRUCT, data)
        self.id = res[0].decode('utf8')
        self.size = res[1]
        self.format = res[2].decode('utf8')


class FormatChunk(object):

    STRUCT_INFO = "4sI"
    STRUCT_FORMAT = 'hhIIhh'

    def __init__(self, file):
        data = file.read(8)
        res = struct.unpack(self.STRUCT_INFO, data)
        self.fmt = res[0].decode('utf8').strip()
        self.size = res[1]

        data = file.read(self.size)
        res = struct.unpack(self.STRUCT_FORMAT, data)
        self.audio_format = res[0]
        self.num_channels = res[1]
        self.sample_rate = res[2]
        self.byte_rate = res[3]
        self.block_align = res[4]
        self.bits_per_sample = res[5]


class DataChunk(object):

    STRUCT = '4sI'
    DATA = 'data'
    LIST = 'LIST'

    def __init__(self, file):
        self.id = None
        self.size = 0
        self.data = None
        data = file.read(8)
        if len(data) < 8:
            return
        res = struct.unpack(self.STRUCT, data)
        self.id = res[0].decode("utf8")
        self.size = res[1]
        self.data = file.read(self.size)


class Wave(object):

    def __init__(self, filename):
        self.filename = filename
        self.riff = None
        self.format = None
        self.datas = []
        self.load()

    def load(self):
        with open(filename, 'rb') as file:
            self.riff = RIFFChunk(file)
            self.format = FormatChunk(file)
            while True:
                data = DataChunk(file)
                if not data.size:
                    break
                if data.id != DataChunk.DATA:
                    continue
                self.datas.append(data)


dirname = os.path.dirname(os.path.abspath(__file__))
filename = os.path.join(dirname, 'input.wav')


wave = Wave(filename)

p = pyaudio.PyAudio()

stream = p.open(format=p.get_format_from_width(wave.format.bits_per_sample // 8),
                channels=wave.format.num_channels,
                rate=wave.format.sample_rate,
                output=True)

for data in wave.datas:
    io = BytesIO(data.data)
    print(wave.format.byte_rate)
    while True:
        chunk = io.read(wave.format.byte_rate)
        if not chunk:
            break
        stream.write(chunk)
    print('data write finish')

stream.stop_stream()
stream.close()

p.terminate()
```

通过我们自己写的程序读取wave文件，就可以使用pyaudio播放音乐了。而且可以更好的理解wave文件的结构，不过Python标准库已经有 wave 包了，所以，没有必要重复造轮子。


## 生成正弦波

了解了上面的这些内容，那么我们自己可以生成一个波形，最常见的有方波和正弦波，下面写代码生成正弦波。然后存储成 wav 文件。

```python
# coding=utf-8

import struct
import math
from io import BytesIO

import wave

bit = 16
channels = 1
rate = 44100
frequency = 440  # A4
second = 5

sample_size = (2 ** bit - 1) // 2


wf = wave.open('output.wav', 'wb')
wf.setnchannels(channels)
wf.setsampwidth(bit // 8)
wf.setframerate(rate)

delta = rate // frequency

io = BytesIO()
for index in range(rate * second):
    var = index * 2 * math.pi / delta
    sample = int(math.sin(var) * sample_size)
    io.write(struct.pack("h", sample))

io.seek(0)
wf.writeframes(io.read())
wf.close()
```

## 绘制波形图像

把刚才生成的wav文件波形画出来，更加直观的看出正弦波的形状。

```python
# coding=utf-8

import os
import wave
import matplotlib.pyplot as plt

filename = 'output.wav'

wf = wave.open(filename, 'rb')

rate = wf.getframerate()
channels = wf.getnchannels()
width = wf.getsampwidth()
frame_count = wf.getnframes()
duration = frame_count / rate

if channels == 1:
    frames = [
        int.from_bytes(wf.readframes(1), byteorder='little', signed=True)
        for var in range(1000)
    ]
    plt.plot(frames)

if channels == 2:
    frames1 = []
    frames2 = []
    for var in range(1000):
        frame = wf.readframes(1)
        frames1.append(int.from_bytes(frame[0:2], byteorder='little', signed=True))
        frames2.append(int.from_bytes(frame[2:4], byteorder='little', signed=True))

    plt.subplot(211)
    plt.plot(frames1)

    plt.subplot(212)
    plt.plot(frames2)

plt.show()
```

由于我在代码里只花了前1000帧，所以看上去是这样的：

![Wave 文件格式解析 波形](http://pqs8hg59d.bkt.clouddn.com/Wave%20%E6%96%87%E4%BB%B6%E6%A0%BC%E5%BC%8F%E8%A7%A3%E6%9E%90%20%E6%B3%A2%E5%BD%A2.jpg)


## 参考资料

- <https://en.wikipedia.org/wiki/WAV>
- <http://soundfile.sapp.org/doc/WaveFormat/>

