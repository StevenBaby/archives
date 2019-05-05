# coding=utf-8

import os
import wave
import matplotlib.pyplot as plt

dirname = os.path.dirname(os.path.abspath(__file__))
filename = os.path.join(dirname, '../her.wav')

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
