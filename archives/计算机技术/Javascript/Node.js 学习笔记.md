# Node.js 学习笔记

[annotation]: <id> (0ad882ed-d9e4-400d-b2ec-b87fdec9c12f)
[annotation]: <status> (public)
[annotation]: <create_time> (2020-06-23 13:20:16)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Nodejs|Javascript)
[annotation]: <comments> (false)
[annotation]: <url> (http://blog.ccyg.studio/article/0ad882ed-d9e4-400d-b2ec-b87fdec9c12f)


## 文件系统

### buffer.js 缓冲区

- buffer 的结构和数组很像，操作方法也和数组类似，直接对内存进行操作
- 数组中不能存储二进制文件， buffer 用来存储二进制数据，性能比 array 高

```js
var str = "hello world";

var buf = Buffer.from(str);

console.log(buf);
```

创建定长 `Buffer` 

```js
// 创建一个指定大小的 buffer 
var size = 1024;

var buf2 = Buffer.alloc(size);
console.log(buf2);

buf2[0] = 88;
console.log(buf2);

var buf3 = Buffer.allocUnsafe(aize);

buffer.toString(); // 将 buffer 中的数据转换为 字符串
```

### fs 文件系统 File System

- 通过 node 读写操作系统中的文件
- fs 是核心模块，直接引入，无需安装
- fs 模块中的操作都有 **同步** 和 **异步** 两种方式

文件的写入

```js
var fs = require('fs');

// 打开文件
var fd = fs.openSync('hello.txt', 'w');

// 写入内容
fs.writeSync(fd， "今天天气真真好！！！");

// 关闭文件
fs.closeSync(fd);
```

异步文件的写入，多了 callback 参数，用于传入回调函数，异步结果，通过回调函数的参数传入。

```js
var fs = require('fs');

fs.open("hello.txt", "r", function(err, fd){
    if (err){
        // 出错
    }else{
        // 没错
    }
})
```

流文件的读写

```js
var fs = require('fs');

var ws = fs.createWriteStream('hello.txt');

ws.once("open", function(){
    console.log('opened');
})

ws.once("close", function(){
    console.log('closed');
})

ws.write("write something");
ws.write("write something");
ws.write("write something");
ws.write("write something");
ws.write("write something");
ws.write("write something");

ws.end(); // 关闭流的入口；

```

文件流管道

```js
var fs = require('fs');

var rs = fs.createReadStream('input.txt');
var ws = fs.createWriteStream('ouput.txt');

rs.pipe(ws); // 将可读流中的数据直接输出到可写流中；
```