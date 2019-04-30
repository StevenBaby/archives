# 使用 MathJax 渲染公式

[annotation]: <id> (1707c51a-0e4d-4c22-a0fb-9e383967d749)
[annotation]: <status> (public)
[annotation]: <create_time> (2019-04-30 17:56:26)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Javascript)
[annotation]: <comments> (true)

由于Markdown文本中可能会插入一些数学公式，类似于下面这样： $\sqrt{a^2+b^2}$ ，也可能是比较复杂的公式：

$$
\begin{matrix}
1 & x & x^2 \\
1 & y & y^2 \\
1 & z & z^2 \\
\end{matrix}
$$

$$X=\left(
    \begin{matrix}
        x_{11} & x_{12} & \cdots & x_{1d} \\
        x_{21} & x_{22} & \cdots & x_{2d} \\
        \vdots & \vdots & \ddots & \vdots \\
        x_{m1} & x_{m2} & \cdots & x_{md} \\
    \end{matrix}
\right)
=\left(
     \begin{matrix}
            x_1^T \\
            x_2^T \\
            \vdots\\
            x_m^T \\
        \end{matrix}
\right)
$$

使用vscode的markdown+math插件可以很简单的解决这个问题，也就是使用latex数学公式的语法来写公式，将公式用两个`$`括起来就可以就可以。但是把markdown渲染成HtML之后就出了一些问题，造成了数学公式显示错误。

意外的发现了使用MathJax 可以很好的解决这个问题，而且和vscode中写的东西完全一致，兴奋至极。

将 MathJax 添加到页面中是很简单的。

1. 添加js引用
```html
<script src="https://cdn.jsdelivr.net/npm/mathjax@2.7.5/MathJax.js?config=TeX-MML-AM_CHTML"></script>
```
2. 添加Latex设置

```html
<script type="text/x-mathjax-config">
MathJax.Hub.Config({
    tex2jax: {
        inlineMath: [
            ['$', '$'],
            ['\\(', '\\)']
        ],
        displayMath: [
            ['$$', '$$'],
            ["\\[", "\\]"]
        ]
    },
    TeX: {
        extensions: ["AMSmath.js", "AMSsymbols.js", "extpfeil.js", "autoload-all.js"]
    },
    "HTML-CSS": {
        preferredFont: "STIX"
    }
});
</script>
```
~~这样正常的话，页面中的公式字符串就会被转化为公式了。不过现在公式支持还是不够友好，有些特别的公式无法正常渲染，以后再改进。~~

~~需要在换行的时候，把双斜杠换成四斜杠。~~ 

在后端渲染 markdown 文件的时候，使用插件 `pymdownx.arithmatex` 可以解决很多问题。<sub><small>2019-04-30 更新</small></sub>

## 参考资料

1. [Getting Started](https://docs.mathjax.org/en/latest/start.html)