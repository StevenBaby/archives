# 使用 PyAudio 处理音频

[annotation]: <id> (57db86c0-786d-4df7-be4b-a5cf6ba48bb1)
[annotation]: <status> (public)
[annotation]: <create_time> (2019-05-03 11:00:55)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Python|音频处理)
[annotation]: <comments> (false)


PyAudio 是 [PortAudio](http://www.portaudio.com/) 的 Python 绑定，跨平台的音频输入输出库。使用 PyAudio 可以很容易的在很多系统平台上用Python来播放和录音。下面是官方给出的例子：

## 播放 Wave 文件

```python
"""PyAudio Example: Play a WAVE file."""

import pyaudio
import wave
import sys

CHUNK = 1024

if len(sys.argv) < 2:
    print("Plays a wave file.\n\nUsage: %s filename.wav" % sys.argv[0])
    sys.exit(-1)

wf = wave.open(sys.argv[1], 'rb')

p = pyaudio.PyAudio()

stream = p.open(format=p.get_format_from_width(wf.getsampwidth()),
                channels=wf.getnchannels(),
                rate=wf.getframerate(),
                output=True)

data = wf.readframes(CHUNK)

while data != '':
    stream.write(data)
    data = wf.readframes(CHUNK)

stream.stop_stream()
stream.close()

p.terminate()
```

## 录音

```python
"""PyAudio example: Record a few seconds of audio and save to a WAVE file."""

import pyaudio
import wave

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 2
RATE = 44100
RECORD_SECONDS = 5
WAVE_OUTPUT_FILENAME = "output.wav"

p = pyaudio.PyAudio()

stream = p.open(format=FORMAT,
                channels=CHANNELS,
                rate=RATE,
                input=True,
                frames_per_buffer=CHUNK)

print("* recording")

frames = []

for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
    data = stream.read(CHUNK)
    frames.append(data)

print("* done recording")

stream.stop_stream()
stream.close()
p.terminate()

wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
wf.setnchannels(CHANNELS)
wf.setsampwidth(p.get_sample_size(FORMAT))
wf.setframerate(RATE)
wf.writeframes(b''.join(frames))
wf.close()
```

## 麦克风监听

```python
"""
PyAudio Example: Make a wire between input and output (i.e., record a
few samples and play them back immediately).
"""

import pyaudio

CHUNK = 1024
WIDTH = 2
CHANNELS = 2
RATE = 44100
RECORD_SECONDS = 5

p = pyaudio.PyAudio()

stream = p.open(format=p.get_format_from_width(WIDTH),
                channels=CHANNELS,
                rate=RATE,
                input=True,
                output=True,
                frames_per_buffer=CHUNK)

print("* recording")

for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
    data = stream.read(CHUNK)
    stream.write(data, CHUNK)

print("* done")

stream.stop_stream()
stream.close()

p.terminate()
```

## 播放（回调）

```python
"""PyAudio Example: Play a wave file (callback version)"""

import pyaudio
import wave
import time
import sys

if len(sys.argv) < 2:
    print("Plays a wave file.\n\nUsage: %s filename.wav" % sys.argv[0])
    sys.exit(-1)

wf = wave.open(sys.argv[1], 'rb')

p = pyaudio.PyAudio()

def callback(in_data, frame_count, time_info, status):
    data = wf.readframes(frame_count)
    return (data, pyaudio.paContinue)

stream = p.open(format=p.get_format_from_width(wf.getsampwidth()),
                channels=wf.getnchannels(),
                rate=wf.getframerate(),
                output=True,
                stream_callback=callback)

stream.start_stream()

while stream.is_active():
    time.sleep(0.1)

stream.stop_stream()
stream.close()
wf.close()

p.terminate()
```

## 麦克风监听（回调）

```python
"""
PyAudio Example: Make a wire between input and output (i.e., record a
few samples and play them back immediately).

This is the callback (non-blocking) version.
"""

import pyaudio
import time

WIDTH = 2
CHANNELS = 2
RATE = 44100

p = pyaudio.PyAudio()

def callback(in_data, frame_count, time_info, status):
    return (in_data, pyaudio.paContinue)

stream = p.open(format=p.get_format_from_width(WIDTH),
                channels=CHANNELS,
                rate=RATE,
                input=True,
                output=True,
                stream_callback=callback)

stream.start_stream()

while stream.is_active():
    time.sleep(0.1)

stream.stop_stream()
stream.close()

p.terminate()
```

## 声道映射（仅支持Mac，未作测试）

```python
"""PyAudio Example: Mac OS X-only: Play a wave file with channel maps."""

import pyaudio
import wave
import sys

chunk = 1024

PyAudio = pyaudio.PyAudio

if len(sys.argv) < 2:
    print("Plays a wave file.\n\nUsage: %s filename.wav" % sys.argv[0])
    sys.exit(-1)

wf = wave.open(sys.argv[1], 'rb')

p = PyAudio()

# standard L-R stereo
# channel_map = (0, 1)

# reverse: R-L stereo
# channel_map = (1, 0)

# no audio
# channel_map = (-1, -1)

# left channel audio --> left speaker; no right channel
# channel_map = (0, -1)

# right channel audio --> right speaker; no left channel
# channel_map = (-1, 1)

# left channel audio --> right speaker
# channel_map = (-1, 0)

# right channel audio --> left speaker
channel_map = (1, -1)
# etc...

try:
    stream_info = pyaudio.PaMacCoreStreamInfo(
        flags=pyaudio.PaMacCoreStreamInfo.paMacCorePlayNice, # default
        channel_map=channel_map)
except AttributeError:
    print("Sorry, couldn't find PaMacCoreStreamInfo. Make sure that "
          "you're running on Mac OS X.")
    sys.exit(-1)

print("Stream Info Flags:", stream_info.get_flags())
print("Stream Info Channel Map:", stream_info.get_channel_map())

# open stream
stream = p.open(
    format=p.get_format_from_width(wf.getsampwidth()),
    channels=wf.getnchannels(),
    rate=wf.getframerate(),
    output=True,
    output_host_api_specific_stream_info=stream_info)

# read data
data = wf.readframes(chunk)

# play stream
while data != '':
    stream.write(data)
    data = wf.readframes(chunk)

stream.stop_stream()
stream.close()

p.terminate()
```

## 参考资料

- <http://people.csail.mit.edu/hubert/pyaudio/>