# coding=utf-8

import struct
import time
from queue import Queue
import threading

import pyaudio
import numpy as np
import matplotlib
import matplotlib.pyplot as plt

from scipy.fftpack import fft

import dandan
logger = dandan.logger.getLogger()


class Audio(object):

    def __init__(self):
        self.chunk = 1024
        self.channels = 1
        self.bit_width = 2
        self.bit = self.bit_width * 8
        self.rate = 44100
        self.input = True
        self.output = True

        self.pyaudio = None
        self.stream = None

        self.buffer = Queue()
        self.running = False
        self.play_thread = threading.Thread(target=self.play_task)
        self.play_thread.setDaemon(True)
        # plot configure

    def play_task(self):
        while self.running:
            frames = self.read_frames()
            if not frames:
                continue
            self.buffer.put(frames)
            self.stream.write(frames)

    def start(self):
        self.running = True
        self.play_thread.start()
        if self.pyaudio is None:
            logger.info('start create pyaudio...')
            self.pyaudio = pyaudio.PyAudio()
        if self.input and self.stream is None:
            logger.info('start create stream...')
            self.stream = self.pyaudio.open(
                format=pyaudio.get_format_from_width(self.bit_width),
                channels=self.channels,
                rate=self.rate,
                input=self.input,
                output=self.output,
                frames_per_buffer=self.chunk,
            )

    def close(self):
        if self.stream:
            logger.info('close pyaudio stream...')
            self.stream.stop_stream()
            self.stream.close()
            self.stream = None
        if self.pyaudio:
            logger.info('terminate pyaudio...')
            self.pyaudio.terminate()
            self.pyaudio = None
        self.running = False

    def __del__(self):
        self.close()

    def read_frames(self):
        if not self.stream:
            return None
        return self.stream.read(self.chunk)

    def get_frames(self):
        frames = self.buffer.get(block=True)
        with self.buffer.mutex:
            self.buffer.queue.clear()
        return frames

    def get_data(self, frames=None):
        if not frames:
            frames = self.get_frames()
        data = struct.unpack(str(self.chunk) + "h", frames)
        data = np.array(data)
        return data

    def get_plot(self):
        plt.ion()
        res = plt.subplots(2, figsize=(16, 9))
        self.figure = res[0]

        self.axes = res[1:][0]
        self.axes[0].grid()
        self.axes[0].set_ylim(-40000, 40000)
        self.axes[0].set_xlim(0, self.chunk)
        # self.axes[0].get_xaxis().set_visible(False)
        # self.axes[0].get_yaxis().set_visible(False)

        self.lines = []
        x = np.arange(0, self.chunk)
        self.lines.append(self.axes[0].plot(x, np.zeros(len(x))).pop())

        # self.axes[1].grid()
        self.axes[1].set_ylim(0, 1)
        # self.axes[1].set_xlim(20, self.rate // 2)
        self.axes[1].set_xticks([20, 440, 880, 20000])
        self.axes[1].get_xaxis().set_major_formatter(matplotlib.ticker.ScalarFormatter())
        x = np.linspace(0, self.rate, self.chunk)
        self.lines.append(self.axes[1].semilogx(x, np.zeros(len(x))).pop())

    def mainloop(self):
        self.get_plot()
        while self.running:
            data = self.get_data()
            self.lines[0].set_ydata(data)

            data_fft = fft(data)
            data_fft = np.abs(data_fft[0:self.chunk]) * 2 / (32768 * self.chunk)

            self.lines[1].set_ydata(data_fft)

            self.figure.canvas.draw()
            self.figure.canvas.flush_events()


audio = Audio()
audio.start()
audio.mainloop()
