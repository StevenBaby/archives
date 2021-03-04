# ELF 文件格式

[annotation]: <id> (6973d37d-4f3f-4d3e-baa1-682f23a741c0)
[annotation]: <status> (public)
[annotation]: <create_time> (2021-03-04 18:32:44)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (文件格式)
[annotation]: <comments> (false)
[annotation]: <url> (http://blog.ccyg.studio/article/6973d37d-4f3f-4d3e-baa1-682f23a741c0)

## ELF 文件简介

ELF 文件是用来干什么的呢？实际上它和 `.exe` 文件类型差不多，都是用来存储可执行程序的，不过 ELF 文件广泛应用于 **Linux** 操作系统，而非 **Windows**。

ELF 的全程是 **Executable and Linking Format** 也就是可执行和链接的格式，那么这种格式的文件主要有三种类型：

1. 可重定位的文件 (Relocatable file)  
    也就是静态链接库，是由汇编器汇编产生的 `.o` 文件，可以用来生成动态链接库，或者可执行文件。
2. 可执行的文件 (Executable file)：就是一般的程序
3. 可被共享的文件 (Shared object file)：
   就是所谓的动态链接库，即 `.so` 文件，静态库可以用来生成程序或者动态链接库，那么动态链接库的主要作用是，如果好多程序都用到了一段公共的代码，那么这部分公共的代码如果都写入每个程序里，那么就会占用额外的空间；那么就可以把这部分代码抽出来，放到操作系统的公共的地方，然后所有的程序都去调用这部分代码。这就是动态链接库的作用。

## ELF 文件格式

![](./images/elf-1.jpg)

ELF 文件由四部分组成：

- ELF 头 (ELF header)
- 程序头表 (Program header table)
- 节 (Sections)
- 节头表 (Section header table)

实际上一个文件中不一定全部包含这些内容，而且它们的位置也不一定，只有 ELF 头的位置是固定的，其余各部分的位置、大小等信息由 ELF 头中的各项值来决定。


## 参考资料

- [ELF.pdf](https://refspecs.linuxfoundation.org/elf/elf.pdf)