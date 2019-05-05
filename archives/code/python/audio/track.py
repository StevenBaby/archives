# coding=utf-8

import matplotlib.pyplot as plt


class Track(object):

    def button_press_event(self, event):
        print(event)

    def scroll_event(self, event):
        print(event)

    def draw(self):
        pass

    def __init__(self, filename):
        self.filename = filename

        self.figure = plt.figure()
        self.figure.canvas.mpl_connect("button_press_event", self.button_press_event)
        self.figure.canvas.mpl_connect("scroll_event", self.scroll_event)


track = Track()
plt.show()
