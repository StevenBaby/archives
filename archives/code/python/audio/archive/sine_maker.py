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
