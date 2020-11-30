import numpy as np
# import fractions
# np.set_printoptions(formatter={'all': lambda x: str(fractions.Fraction(x).limit_denominator())})


# 初始化一个非奇异矩阵(数组)
a = np.array([[1, 1, 1], [1, 2, 3], [1, 4, 9]])

# 对应于MATLAB中 inv() 函数
print(np.linalg.inv(a))

# 矩阵对象可以通过 .I 更方便的求逆
A = np.matrix(a)
print(A.I)

# 矩阵转置
print(A.T)

# 矩阵特征值和特征向量

eigenvalues, eigenvectors = np.linalg.eig(A)
print(eigenvalues)
print(eigenvectors)
