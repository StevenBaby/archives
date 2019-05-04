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
| Subchunk1Size | 4 | 本块数据的大小，(对于PCM, 值为16 |
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



## 参考资料

- <https://en.wikipedia.org/wiki/WAV>
- <http://soundfile.sapp.org/doc/WaveFormat/>

