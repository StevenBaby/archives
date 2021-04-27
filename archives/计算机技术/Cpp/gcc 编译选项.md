# gcc 编译选项

[annotation]: [id] (c786641e-0dcd-422a-b560-b3fe0c57e6cc)
[annotation]: [status] (public)
[annotation]: [create_time] (2021-04-27 14:08:04)
[annotation]: [category] (计算机技术)
[annotation]: [tags] (C/C++|gcc)
[annotation]: [comments] (false)
[annotation]: [url] (http://blog.ccyg.studio/article/c786641e-0dcd-422a-b560-b3fe0c57e6cc)

- -x language

    指定文件语言

- -c

    编译或汇编源文件，但不链接

- -S

    输出汇编代码

- -E

    输出预处理代码

- -o file

    指定输出文件

- --version

    打印版本号

- -pipe

    在编译的不同阶段使用管道代替临时文件

- -std=

    指定语言标准

- -fno-builtin
- -fno-builtin-function

    不识别 gcc 内置函数，gcc 可能将 c 标准函数用内置函数代替

- -fno-stack-protector

    禁用堆栈保护

- -fno-stack-protector
- -nostdlib
- -nostdinc
- -nostartfiles
- -nodefaultlibs
- -fpermissive


## 参考资料

- [Using the GNU Compiler Collection (GCC)](https://gcc.gnu.org/onlinedocs/gcc-10.3.0/gcc/)