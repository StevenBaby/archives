# GNU Make 项目管理 附录 A 运行 make

[annotation]: [id] (96a0f548-acfc-47e2-97be-45d3682d3bbb)
[annotation]: [status] (public)
[annotation]: [create_time] (2021-04-24 13:10:41)
[annotation]: [category] (读书笔记)
[annotation]: [tags] (Make|Makefile|GNU)
[annotation]: [topic] (GNU Make项目管理)
[annotation]: [index] (13)
[annotation]: [comments] (true)
[annotation]: [url] (http://blog.ccyg.studio/article/96a0f548-acfc-47e2-97be-45d3682d3bbb)

GNU make有一组令人印象深刻的命令行选项。大多数命令行选项包括短格式和长格式。短命令以一个 `-` 后跟一个字符表示，而长命令以 `--` 开头，通常后跟用 `-` 分隔的整个单词。这些命令的语法如下:

```bash
-o argument 
--option-word=argument
```

以下是最常用的选项。要获得完整的清单，请参阅 GNU make 手册或键入 `make --help`。

## --always-make -B

首先假设每个目标都过期了，然后更新所有目标。

## --directory=directory -C directory

在搜索 makefile 或执行任何工作之前，更改到给定目录。这也将变量 `CURDIR` 设置为 directory。

## --environment-overrides -e

当需要选择时，如果更喜欢环境变量而不是 makefile 变量。则这个命令行选项可以在 makefile 中用 `override` 指令覆盖特定变量。

## --file=makefile -f makefile

读取给定的文件作为 makefile，而不是默认名称 (例如，makefile、Makefile 或 GNUMakefile)。

## --help -h

打印命令行选项的摘要。

## --include-dir=directory -I directory

如果当前目录中不存在 `include` 文件，在编译搜索路径之前，将在指定的目录中查找包含文件。在命令行上可以给出任意数量的 `--include-dir` 选项。

## --keep-going -k

如果命令返回错误状态，不会终止 make 进程。相反，会跳过当前目标的其余部分，并继续处理其他目标。

## --just-print -n

显示将由 make 执行的命令集，但不执行命令脚本中的任何命令。当你想在实际操作之前知道 make 会做什么时，这是非常有用的。请注意，此选项并不阻止 `shell` 函数中的代码执行，只是阻止命令脚本中的命令执行。

## --old-file=file -o file

将文件视为无限旧的，并执行适当的操作来更新目标。如果文件被意外地碰触，或者用于确定一个依赖对依赖关系图的影响，这将非常有用。这是 `--new-file (-W)` 的补充。

## --print-data-base -p

打印 make 的内部数据库。

## --touch -t

对每个过期的目标执行 `touch` 以更新其时间戳。这对于更新依赖关系图中的文件非常有用。例如，编辑核心头文件中的注释可能会导致 make 不必要地重新编译大量代码。您可以使用`--touch` 选项强制所有文件都是最新的，而不是执行编译和浪费机器周期。

## --new-file=file -W file

假设文件比任何目标都要新。这在强制更新目标时很有用，而不需要编辑或 `touch` 文件。这是 `--oldfile` 的补充。

## --warn-undefined-variables

如果展开未定义的变量，则打印警告消息。这是一个有用的诊断工具，因为未定义的变量会悄然消失。然而，出于自定义的目的，在 makefile 中包含空变量也很常见。任何未设置的自定义变量也将由该选项打印警告。

## 参考资料

- [Managing Projects with GNU Make](https://book.douban.com/subject/1850994/)
