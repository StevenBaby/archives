# Javascript 笔记

[annotation]: <id> (6216bef6-528d-4ca0-ae50-5ff40d43db9c)
[annotation]: <status> (public)
[annotation]: <create_time> (2020-06-23 17:09:29)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Javascript)
[annotation]: <comments> (false)
[annotation]: <url> (http://blog.ccyg.studio/article/6216bef6-528d-4ca0-ae50-5ff40d43db9c)

## 基础类型

- number
- string
- boolean
- null
- undefined
- object

获取变量类型

```js
typeof(variable);
typeof variable;
```

**浮点数运算可能出现精度问题**，比如：

```js
console.log(0.1 + 0.2);
```

Output:

```
0.30000000000000004
```

判断变量是否为数字

```js
isNaN(number);
```

类型转换：

```js
parseInt(v); // 转换整型
parseFloat(v); // 转换浮点型
Number(v) // 转换数字，更加严格
v.toString() // 通过变量转字符串
String(v) // 生成字符串 
Boolean(v); // 转换布尔值；
```

## 数组 `Array`

```js
var list = new Array();

var array = [1, "hello", 2, 4.5];
```

- 数组中的内容类型可以不同

## 一些问题

- 隐式全局变量

## Javascript 的三个部分

- ECMAScript 标准：js 的基本语法
- DOM：
- BOM： 