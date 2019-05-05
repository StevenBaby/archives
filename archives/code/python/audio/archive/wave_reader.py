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

    def __str__(self):
        return '{}_{}_{}'.format(self.id, self.size, self.format)


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

    def __str__(self):
        return "{fmt}_{size}_{audio_format}_{num_channels}_{sample_rate}_{byte_rate}_{block_align}_{bits_per_sample}".format(
            fmt=self.fmt,
            size=self.size,
            audio_format=self.audio_format,
            num_channels=self.num_channels,
            sample_rate=self.sample_rate,
            byte_rate=self.byte_rate,
            block_align=self.block_align,
            bits_per_sample=self.bits_per_sample,
        )


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

    def __str__(self):
        return "{}_{}".format(self.id, self.size)


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
filename = os.path.join(dirname, 'her.wav')


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
