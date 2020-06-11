# coding=utf-8

import matplotlib.pyplot as plt
import matplotlib.pylab as pl

from sklearn import datasets
from tone import utils

logger = utils.logger.get_logger()


digits = datasets.load_digits()
images = digits.images

logger.debug(images[0])
