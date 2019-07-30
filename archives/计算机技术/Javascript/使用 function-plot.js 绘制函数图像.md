# 使用 function-plot.js 绘制函数图像

[annotation]: <id> (a990ef39-a99d-4b8e-a96f-34e9db046366)
[annotation]: <status> (public)
[annotation]: <create_time> (2019-04-30 16:35:49)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Javascript)
[annotation]: <comments> (true)


## 绘制图像

<div class="ui segment">
<div id="root"></div>
</div>

<div>
<script src="https://cdn.jsdelivr.net/npm/jquery@3.4.0/dist/jquery.min.js"></script>
<script src="https://unpkg.com/d3@3/d3.min.js"></script>
<script src="https://unpkg.com/function-plot@1/dist/function-plot.js"></script>
</div>

<script>
/* jshint esversion: 6 */
function plot() {
    functionPlot({
        target: "#root",
        width: $('#root').width(),
        height: $('#root').width() / 1.77,
        yAxis: {
            domain: [-5, 5]
        },
        tip: {
            renderer: function () {}
        },
        grid: true,
        data: [{
                fn: "x^2",
                derivative: {
                    fn: "2 * x",
                    updateOnMouseMove: true
                }
            },{
                fn: "sin(x)",
            },{
                fn: "x - 1/6 * x^3",
            }
        ]
    });
}

$(document).ready(function () {
    plot();
});

$(window).resize(function () {
    plot();
});
</script>

如图所示，这个函数图像就是由 function-plot.js 绘制出来的。其中我绘制了下面三个函数：

$$
\begin{aligned}
f(x) &= x ^ 2
\\
f(x) &= sin\ x
\\
f(x) &= x - \frac{1}{6} x ^ 3
\\
\end{aligned}
$$

其中我在 $f(x)=x^2$ 的函数图像上绘制了与鼠标位置对应的切线（也就是提供了的导数）。而$f(x)=x-\frac{1}{6}x^3$ 是 $f(x) = sin x$ 的简单泰勒展开，可以看到两个函数在趋向于0的过程中是及其相似的，也就是所谓的**等价无穷小**，也就是为什么 $x - sin\ x \sim \frac{1}{6}x^3$。

## 具体实现


首先在页面中定义绘制的对象和引入js文件:

```html
<div id="root"></div>
<script src="https://cdn.jsdelivr.net/npm/jquery@3.4.0/dist/jquery.min.js"></script>
<script src="https://unpkg.com/d3@3/d3.min.js"></script>
<script src="https://unpkg.com/function-plot@1/dist/function-plot.js"></script>
```

然后写 javascript 代码进行绘制，用jquery额外处理了浏览器窗体变化之后重绘的尺寸。

```javascript
/* jshint esversion: 6 */
function plot() {
    functionPlot({
        target: "#root",
        width: $('#root').width(),
        height: $('#root').width() / 1.77,
        yAxis: {
            domain: [-5, 5]
        },
        tip: {
            renderer: function () {}
        },
        grid: true,
        data: [{
                fn: "x^2",
                derivative: {
                    fn: "2 * x",
                    updateOnMouseMove: true
                }
            },{
                fn: "sin(x)",
            },{
                fn: "x - 1/6 * x^3",
            }
        ]
    });
}

$(document).ready(function () {
    plot();
});

$(window).resize(function () {
    plot();
});
```

## 参考资料

- <https://mauriciopoppe.github.io/function-plot/>
