# coding=utf-8
import math
import numpy as np

m0 = np.array([1, 2, -4])
m1 = np.array([0, -5, 0])
s = np.array([1, 7, 0])

a = m0 - m1
print(a)

c = np.cross(a, s)

print(c)
print(c**2)
print(sum(c**2))

print(s**2)
print(sum(s**2))

print(sum(c**2) / sum(s**2))

# norm = np.linalg.norm(c)
