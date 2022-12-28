# Python 虚数单位

[annotation]: [id] (ab55f39a-4b9b-45f1-b63d-44c921ff948e)
[annotation]: [status] (public)
[annotation]: [create_time] (2022-12-24 21:03:31)
[annotation]: [category] (计算机技术)
[annotation]: [tags] (Python)
[annotation]: [comments] (true)
[annotation]: [url] (http://blog.ccyg.studio/article/ab55f39a-4b9b-45f1-b63d-44c921ff948e)

遇到了一个比较有意思的问题，表示复数一般有两种方法，其中一种如下表示：

$$
c = a + bi
$$

其中 $c$ 表示复数，而它有两部分组成其中 $a$ 表示实数部分，$b$ 表示虚数部分，$i = \sqrt{-1}$ 表示虚数单位。数学上一般用 $i$ 来表示虚数单位，是 imaginary 的首字母。

## Python

但是，Python 中用 $j$ 来表示虚数单位，这是一个不一致，并且不是显然的，所以一定有某些历史性的原因导致了这个选择。

经过一番搜索 StackOverflow [^pythonj] [^py] 中对这个选择做出了解释，说 Python 遵循了电子工程惯例。意味着在电子工程领域是使用 $j$ 作为虚数单位的，另一方面 Python 之父 Guido van Rossum 也表示，字母 i/I 看起来更像是数字，所以没有必要做出可配置的选项来支持虚数单位 $i$，再者说，有很多方法可以将虚数单位从 $i$ 转换成 $j$。

## 电子工程

那为什么电子工程要用 $j$ 而不是 $i$？

根据 [^ee] 的描述，在电子工程领域 $i$ 保留用于 **电流**，于是这也比较合理，一般用 $i$ 表示电流，单位安培。

## 参考

[^pythonj]: <https://stackoverflow.com/questions/24812444/why-are-complex-numbers-in-python-denoted-with-j-instead-of-i#:~:text=Python%20adopted%20the%20convention%20used,the%20square%20root%20of%20%2D1.>
[^py]: <http://bugs.python.org/issue10562>
[^ee]: <https://www.sciencedirect.com/topics/engineering/imaginary-number#:~:text=Electrical%20engineers%20use%20imaginary%20numbers,number%20rather%20than%20behind%20it.>