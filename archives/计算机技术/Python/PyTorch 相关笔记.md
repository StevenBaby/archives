# PyTorch 相关笔记

[annotation]: [id] (167de951-a456-4ff3-b936-101082f72647)
[annotation]: [status] (public)
[annotation]: [create_time] (2021-11-09 00:29:09)
[annotation]: [category] (计算机技术)
[annotation]: [tags] (深度学习|人工智能|PyTorch)
[annotation]: [comments] (true)
[annotation]: [url] (http://blog.ccyg.studio/article/167de951-a456-4ff3-b936-101082f72647)


## torch.utils.data.Dataset

数据集的抽象类，其中有两个方法 `__len__()` 和 `__getitem__()`，是 Python 的魔法方法，可以理解 C++ 的运算符重载，但是Python 的运算符与 C++ 稍有不同：

- `__len__()`：用于Python `len` 函数，用来求取数据集元素的数量
- `__getitem__()`：用于Python `[index]` 索引，用来获取数据集中第 `index` 个元素

## torch.utils.data.DataLoader

数据加载器，将数据集和采样器结合，在给定数据集上提供一个可迭代的功能。
