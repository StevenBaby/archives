# GCC 链接 nasm 汇编的两个警告分析

[annotation]: [id] (d04719a8-315e-48c3-9da1-1228e0782728)
[annotation]: [status] (public)
[annotation]: [create_time] (2021-07-12 16:29:36)
[annotation]: [category] (计算机技术)
[annotation]: [tags] (汇编语言|C/C++)
[annotation]: [comments] (false)
[annotation]: [url] (http://blog.ccyg.studio/article/d04719a8-315e-48c3-9da1-1228e0782728)

下面是一个 `hello world!!!` 程序使用 `nasm` 汇编，调用 32位系统调用，然后退出的程序。过程简单，但是存在一个问题 ……

```s
[bits 32]

section .text
global main
main:

    mov eax, 4; write
    mov ebx, 1; stdout
    mov ecx, message; buffer
    mov edx, message_end - message
    int 0x80

    mov eax, 1; exit
    mov ebx, 0; status
    int 0x80

section .data
    message db "hello world!!!", 10, 13, 0
    message_end:

```

使用 `nasm` 汇编生成目标文件：

    nasm -f elf32 hello.asm -o hello.o


使用 `ld` 链接生成程序：

    ld hello.o -m elf_i386 -o hello -e main

迄今为止，是没有问题的，程序也可以很好的运行。

但是如果使用 `gcc` 链接：

    gcc -m32 hello.o -o hello

会报两个警告，警告如下：

```language
/usr/bin/ld: hello.o: warning: relocation in read-only section `.text'
/usr/bin/ld: warning: creating DT_TEXTREL in a PIE
```

很显然这两个警告是有 `ld` 连接器生成的，但是生成的程序时可以执行的；现在我们具体来分析一下，这两个警告究竟是什么意思。

## 相关警告的解释

第一个显然是 在只读段 `.text` 中重定位，所以我们必须理解动态链接重定位的过程。

实际上手动写得汇编代码，并不是位置无关的，所以想要将位置相关的代码放进位置无关的程序时，就会出现这种问题。

由于位置无关，动态链接时具体的符号在什么地方是需要在符号表中查找的，然后再写入具体的代码位置，但是代码是只读的，所以就会有这个问题。

在上面的例子中，如果是位置无关，`message` 这个符号的位置，就是不确定的了。所以需要在执行时重定位。

---

第二个错误 表示在 PIE 中创建 DT_TEXTREL，其中 PIE 表示 Position Independent Executable / 位置无关的可执行程序。

> DT_TEXTREL
> 
>    Indicates that one or more relocation entries might request modifications to a non-writable segment, and the runtime linker can prepare accordingly. This element's use has been superseded by the DF_TEXTREL flag. See “Position-Independent Code”.

由上可知，DT_TEXTREL，这个符号标记了，代码段有重定位发生。也就是说，可能会写代码段，而一般来说，代码段是只读的，所以可能会有问题。

一旦代码段可写，也就意味着，代码不可重入。多线程/进程同时调用就会有资源竞争发生。所以是一个潜在的错误源。

## 问题的解决

这种问题，可以简单的用两种方式解决，

---

一种是静态链接，链接时加上 `-static` 选项。

或者，链接时加上 `-no-pie` 选项，去掉位置无关的功能。

但总体来说，两种选项殊途同归。

---

另一种是，写代码时写成位置无关的代码，可以参考如下信息：

<https://www.nasm.us/doc/nasmdoc8.html#section-8.9.3>

<https://www.nasm.us/doc/nasmdo10.html#section-10.2>

但是，这样的话代码的复杂度就会提高，感觉不是一个可行的方案。

## 参考资料

- <https://docs.oracle.com/cd/E19683-01/816-7529/chapter6-42444/index.html>
- <https://www.nasm.us/doc/nasmdoc8.html#section-8.9.3>
- <https://www.nasm.us/doc/nasmdo10.html#section-10.2>

