# ELF 文件分析工具

[annotation]: [id] (b749f890-9b5d-433f-9964-0211a48d5aae)
[annotation]: [status] (public)
[annotation]: [create_time] (2021-07-16 17:21:15)
[annotation]: [category] (计算机技术)
[annotation]: [tags] ()
[annotation]: [comments] (false)
[annotation]: [url] (http://blog.ccyg.studio/article/b749f890-9b5d-433f-9964-0211a48d5aae)

## readelf

| 选项       | 功能                      |
| ---------- | ------------------------- |
| -a         | 显示所有信息              |
| -h         | 显示 ELF 头信息           |
| -l         | 显示程序头信息            |
| -S         | 显示节 (section) 头信息   |
| -g         | 显示节 (section) 组信息   |
| -t         | 显示节 (section) 详细信息 |
| -s         | 显示符号表信息            |
| --dyn-syms | 显示动态符号表信息        |
| -C         | 对所有 C++ 符号反修饰     |
| -e         | 显示所有头信息            |
| -n         | 显示 NOTE 段的内容        |
| -r         | 显示重定位段的内容        |
| -d         | 显示动态链接段的内容      |
| -A         | 显示文件架构信息          |
| -x         | 显示段内容的 16 进制      |


## objdump

| 选项       | 功能                                    |
| ---------- | --------------------------------------- |
| -a         | 列举 `.a` 文件中的所有目标文件          |
| -b bfdname | 指定 BFD 名                             |
| -C         | 对所有 C++ 符号反修饰 (Demangle)        |
| -g         | 显示调试信息                            |
| -d         | 对包含机器指令的段进行反编译            |
| -D         | 对所有段进行反编译                      |
| -f         | 显示所有文件头信息                      |
| -h         | 显示段表                                |
| -l         | 显示行号信息  对 `-d` 有用              |
| -j name    | 显示 section name                       |
| -p         | 显示专有头部信息                        |
| -r         | 显示重定位信息                          |
| -R         | 显示动态链接重定位信息                  |
| -s         | 显示所有文件内容                        |
| -S         | 显示源代码和反汇编代码                  |
| -W         | 显示文件中包含有 DWARF 调试信息格式的段 |
| -t         | 显示文件中的符号表                      |
| -T         | 显示动态链接符号表                      |
| -x         | 显示文件的所有文件头                    |
