# Python 矩阵运算

[annotation]: <id> (1b7789fd-1afe-4a52-94ba-52b78baa25fa)
[annotation]: <status> (public)
[annotation]: <create_time> (2020-11-30 18:51:25)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Python|矩阵运算)
[annotation]: <comments> (false)
[annotation]: <url> (http://blog.ccyg.studio/article/1b7789fd-1afe-4a52-94ba-52b78baa25fa)

## 矩阵求逆

测试矩阵如下：

$$A = \left[
\begin{array}{ccc}
1 & 1 & 1 \\
1 & 2 & 3 \\
1 & 4 & 9 \\
\end{array}
\right]$$

```python
import numpy as np

# 初始化一个非奇异矩阵(数组)
a = np.array([[1, 1, 1], [1, 2, 3], [1, 4, 9]])

# 对应于MATLAB中 inv() 函数
print(np.linalg.inv(a))

# 矩阵对象可以通过 .I 更方便的求逆
A = np.matrix(a)
print(A.I)
```

---

```text
[[ 3.  -2.5  0.5]
 [-3.   4.  -1. ]
 [ 1.  -1.5  0.5]]
[[ 3.  -2.5  0.5]
 [-3.   4.  -1. ]
 [ 1.  -1.5  0.5]]
```

$$A^{-1} = \left[
\begin{array}{ccc}
3 & -\frac{5}{2} & \frac{1}{2} \\
-3 & 4 & 3 \\
1 &  -\frac{3}{2}& \frac{1}{2} \\
\end{array}
\right]$$

## 矩阵转置


```python
# 矩阵转置
print(A.T)
```
----

```python
[[1 1 1]
 [1 2 4]
 [1 3 9]]
```

## 矩阵特征值和特征向量

```python
eigenvalues, eigenvectors = np.linalg.eig(A)
print(eigenvalues)
print(eigenvectors)
```
----

```text
[10.60311024  1.24543789  0.15145187]
[[-0.132363   -0.72999807  0.57300039]
 [-0.34005127 -0.56448038 -0.76916357]
 [-0.9310452   0.38531119  0.28294516]]
```

