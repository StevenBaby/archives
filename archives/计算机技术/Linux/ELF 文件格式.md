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
- 程序头部表 (Program header table)
- 节 (Sections)
- 节头部表 (Section header table)

实际上一个文件中不一定全部包含这些内容，而且它们的位置也不一定，只有 ELF 头的位置是固定的，在文件的头部；其余各部分的位置、大小等信息由 ELF 头中的各项值来决定。


程序头部表：如果存在的话，告诉系统如何创建进程映像，一个可执行文件必须有一个**程序头部表**；重定位文件不需要程序头部表；

节头部表：包含描述文件节的信息，每个节在表中有一个入口；每个入口包含一些关于节的信息，比如名称、大小等等。可链接文件必须有一个节头部表；其他的文件可能有也可能没有。

---

由于 ELF 文件力求支持从 8 位到 32 位不同架构的处理器，所以才定义了下表中这些数据类型，而且，ELF 还可能扩展到更大的架构；因此文件中有一些控制数据，从而让文件格式与机器无关。使得文件可以以一种通用的方式来表示内容。剩下的内容用来给目标处理器编码，无关文件是在什么机器上创建的。

| 名称          | 大小 | 对齐 | 用途               |
| ------------- | ---- | ---- | ------------------ |
| Elf32_Addr    | 4    | 4    | 无符号程序地址     |
| Elf32_Half    | 2    | 2    | 无符号中等大小整数 |
| Elf32_Off     | 4    | 4    | 无符号文件偏移     |
| Elf32_Sword   | 4    | 4    | 有符号大整数       |
| Elf32_Word    | 4    | 4    | 无符号大整数       |
| unsigned char | 1    | 1    | 无符号小整数       |

----

ELF header 的格式如下代码所示。

```c
#define EI_NIDENT 16
typedef struct {
    unsigned char e_ident[EI_NIDENT];
    Elf32_Half e_type;
    Elf32_Half e_machine;
    Elf32_Word e_version;
    Elf32_Addr e_entry;
    Elf32_Off e_phoff;
    Elf32_Off e_shoff;
    Elf32_Word e_flags;
    Elf32_Half e_ehsize;
    Elf32_Half e_phentsize;
    Elf32_Half e_phnum;
    Elf32_Half e_shentsize;
    Elf32_Half e_shnum;
    Elf32_Half e_shstrndx;
} Elf32_Ehdr;
```

- e_ident：最开头的16字节，其中包含用以表示 ELF 文件的字符，及其它与机器无关的信息。
- 
## 参考资料

- [ELF.pdf](https://refspecs.linuxfoundation.org/elf/elf.pdf)
- [ELF文件格式解析](https://blog.csdn.net/mergerly/article/details/94585901)