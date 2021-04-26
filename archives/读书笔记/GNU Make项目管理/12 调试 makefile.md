# GNU Make 项目管理 第十二章 调试 makefile

[annotation]: [id] (0dc9f8c3-b627-4766-98bd-bd71df125251)
[annotation]: [status] (public)
[annotation]: [create_time] (2021-04-18 19:24:21)
[annotation]: [category] (读书笔记)
[annotation]: [tags] (Make|Makefile|GNU)
[annotation]: [topic] (GNU Make 项目管理)
[annotation]: [index] (12)
[annotation]: [comments] (true)
[annotation]: [url] (http://blog.ccyg.studio/article/0dc9f8c3-b627-4766-98bd-bd71df125251)

调试 makefile 有点像一门魔法。不幸的是，没有 makefile 调试器这样的东西来检查特定规则是如何计算的或变量是如何展开的。相反，大多数调试都是通过简单的 print 语句和检查 makefile 来执行的。GNU make 通过各种内置函数和命令行选项提供了一些帮助。

调试 makefile 的最佳方法之一是添加调试钩子，并使用防御性编程技术，当事情出错时，您可以使用这些技术。我将介绍一些我认为最有帮助的基本调试技术和防御性编码实践。

## make 的调试特性

`warning` 函数对于调试不规则的 makefile 非常有用。因为 `warning` 函数扩展为空字符串，所以它可以放在 makefile 中的任何位置:在顶层、在目标或依赖列表中，以及在命令脚本中。这允许您在最方便检查变量的任何地方打印变量的值。例如:

```makefile
$(warning A top-level warning)

FOO := $(warning Right-hand side of a simple variable)bar
BAZ = $(warning Right-hand side of a recursive variable)boo

$(warning A target)target: $(warning In a prerequisite list)makefile $(BAZ)
    $(warning In a command script)
    ls
$(BAZ):
```

输出：

```text
$ make
makefile:1: A top-level warning
makefile:2: Right-hand side of a simple variable
makefile:5: A target
makefile:5: In a prerequisite list
makefile:5: Right-hand side of a recursive variable
makefile:8: Right-hand side of a recursive variable
makefile:6: In a command script
ls
makefile
```

注意，`warning` 函数的求值遵循直接和延迟求值的正常 make 算法。尽管给 `BAZ` 的赋值包含一个警告，但是直到在依赖列表中对 `BAZ` 求值后，才会打印该消息。可以在任何地方注入 `warning` 调用的能力使其成为必要的调试工具。

### 命令行选项

我发现有三个命令行选项对调试最有用: `--justprint (-n)`、`--print-database (-p)` 和 `--warn-undefined-variables`。

#### --just-print

我对一个新的 makefile 目标执行的第一个测试是使用 `--justprint (-n)` 选项调用 make。这将导致 make 读取 makefile 并打印它通常为更新目标而执行的每个命令，但不执行它们。为了方便起见，GNU make 还会回显带有静默修饰符 `@` 的命令。

该选项应该抑制所有命令执行。虽然这在某种意义上是正确的，但实际上，你必须小心。虽然 make 不会执行命令脚本，但它将计算在立即上下文中发生的 shell 函数调用。例如:

```makefile
REQUIRED_DIRS = ...
_MKDIRS := $(shell for d in $(REQUIRED_DIRS); \
    do \
        [[ -d $$d ]] || mkdir -p $$d; \
    done)
$(objects) : $(sources)
```

如前所述，`_MKDIRS` 简单变量的目的是触发基本目录的创建。当使用 `--just-print` 执行此命令时，当读取 makefile 时将像往常一样执行 shell 命令。然后 make 将回显(不执行)更新 `$(objects)` 文件列表所需的每个编译命令。

#### --print-data-base

`--print-data-base (-p)` 选项是另一个您将经常使用的选项。它执行 makefile，在 make 运行命令时显示 GNU 版权，然后转储它的内部数据库。数据被收集到一组值中:变量、目录、隐式规则、特定于模式的变量、文件(显式规则) 和 vpath 搜索路径:

```makefile
# GNU Make 3.80
# Copyright (C) 2002 Free Software Foundation, Inc.
# This is free software; see the source for copying conditions.
# There is NO warranty; not even for MERCHANTABILITY or FITNESS FOR A
# PARTICULAR PURPOSE.
normal command execution occurs here

# Make data base, printed on Thu Apr 29 20:58:13 2004
# Variables
…
# Directories
…
# Implicit Rules
…
# Pattern-specific variable values
…
# Files
…
# VPATH Search Paths
```

让我们更详细地研究这些部分。

变量部分列出了每个变量，并附有描述性注释:

```makefile
# automatic
<D = $(patsubst %/,%,$(dir $<))
# environment
EMACS_DIR = C:/usr/emacs-21.3.50.7
# default
CWEAVE = cweave
# makefile (from `../mp3_player/makefile', line 35)
CPPFLAGS = $(addprefix -I ,$(include_dirs))
# makefile (from `../ch07-separate-binaries/makefile', line 44)
RM := rm -f
# makefile (from `../mp3_player/makefile', line 14)
define make-library
    libraries += $1
    sources += $2

    $1: $(call source-to-object,$2)
        $(AR) $(ARFLAGS) $$@ $$^
endef
```

自动变量不会被打印出来，但是方便的变量会被打印出来，比如 `$(<D)`。注释指出了源函数返回的变量类型(参见第4章“次要杂项函数”一节)。如果变量在文件中定义，则给出了定义的文件名和行号。简单变量和递归变量是由赋值操作符区分的。一个简单变量的值将显示为右侧的计算形式。

下一节名为“目录”，它对开发人员比对用户更有用。它列出了 make 检查的目录，包括可能存在但通常不存在的 SCCS 和 RCS 子目录。对于每个目录，make 显示实现细节，例如设备号、inode 和文件模式匹配的统计信息。

下面是隐式规则一节。这包含 make 数据库中所有内置的和用户定义的模式规则。同样，对于那些在文件中定义的规则，注释表示文件和行号:

```makefile
%.c %.h: %.y
# commands to execute (from `../mp3_player/makefile', line 73):
    $(YACC.y) --defines $<
    $(MV) y.tab.c $*.c
    $(MV) y.tab.h $*.h

%: %.c
# commands to execute (built-in):
    $(LINK.c) $^ $(LOADLIBES) $(LDLIBS) -o $@

%.o: %.c
# commands to execute (built-in):
    $(COMPILE.c) $(OUTPUT_OPTION) $<
```

检查本节是熟悉 make 内建规则的多样性和结构的好方法。当然，并不是所有内置规则都实现为模式规则。如果您没有找到要查找的规则，请检查文件部分，其中列出了旧式后缀规则。

下一节将对 makefile 中定义的特定于模式的变量进行编目。回想一下，特定于模式的变量是变量定义，其作用域正是与之相关的模式规则的执行时间。例如，模式变量 `YYLEXFLAG` 定义为:

```makefile
%.c %.h: YYLEXFLAG := -d
%.c %.h: %.y
    $(YACC.y) --defines $<
    $(MV) y.tab.c $*.c
    $(MV) y.tab.h $*.h
```

将显示为:

```makefile
# Pattern-specific variable values

%.c :
# makefile (from `Makefile', line 1)
# YYLEXFLAG := -d
# variable set hash-table stats:
# Load=1/16=6%, Rehash=0, Collisions=0/1=0%

%.h :
# makefile (from `Makefile', line 1)
# YYLEXFLAG := -d
# variable set hash-table stats:
# Load=1/16=6%, Rehash=0, Collisions=0/1=0%

# 2 pattern-specific variable values
```

Files 部分后面列出了与特定文件相关的所有显式和后缀规则:

```makefile
# Not a target:
.p.o:
# Implicit rule search has not been done.
# Modification time never checked.
# File has not been updated.
# commands to execute (built-in):
    $(COMPILE.p) $(OUTPUT_OPTION) $<

lib/ui/libui.a: lib/ui/ui.o
# Implicit rule search has not been done.
# Last modified 2004-04-01 22:04:09.515625
# File has been updated.
# Successfully updated.
# commands to execute (from `../mp3_player/lib/ui/module.mk', line 3):
    ar rv $@ $^

lib/codec/codec.o: ../mp3_player/lib/codec/codec.c ../mp3_player/lib/codec/codec.c ..
/mp3_player/include/codec/codec.h
# Implicit rule search has been done.
# Implicit/static pattern stem: `lib/codec/codec'
# Last modified 2004-04-01 22:04:08.40625
# File has been updated.
# Successfully updated.
# commands to execute (built-in):
    $(COMPILE.c) $(OUTPUT_OPTION) $<
```

中间文件和后缀规则被标记为“不是目标”;其余的都是目标。每个文件都包含注释，指示 make 如何处理规则。通过普通 vpath 搜索找到的文件将显示其解析路径。

最后一节标记为 VPATH 搜索路径，并列出了 VPATH 的值和所有 VPATH 模式。

对于大量使用自定义函数和 eval 来创建复杂变量和规则的 makefile，检查此输出通常是验证宏展开是否生成了预期值的唯一方法。

#### --warn-undefined-variables

每当展开未定义的变量时，此选项会导致 make 显示警告。由于未定义的变量扩展为空字符串，变量名中的排印错误通常很长一段时间都没有被发现。这个选项的问题(也是我很少使用它的原因)是，许多内置规则包括未定义的变量作为用户定义值的钩子。因此，使用此选项运行 make 将不可避免地产生许多警告，这些警告不是错误，而且与用户的 makefile 没有任何有用的关系。例如:

```text
$ make --warn-undefined-variables -n
makefile:35: warning: undefined variable MAKECMDGOALS
makefile:45: warning: undefined variable CFLAGS
makefile:45: warning: undefined variable TARGET_ARCH
...
makefile:35: warning: undefined variable MAKECMDGOALS
make: warning: undefined variable CFLAGS
make: warning: undefined variable TARGET_ARCH
make: warning: undefined variable CFLAGS
make: warning: undefined variable TARGET_ARCH
...
make: warning: undefined variable LDFLAGS
make: warning: undefined variable TARGET_ARCH
make: warning: undefined variable LOADLIBES
make: warning: undefined variable LDLIBS
```

尽管如此，这个命令有时在捕获这类错误方面非常有价值。

### --debug 选项

当您需要了解 make 如何分析依赖关系图时，请使用 `--debug` 选项。这提供了除运行调试器外可用的最详细信息。有五个调试选项和一个修饰符: bisic、verbose、implicit、jobs、all 和 makefile。

如果将调试选项指定为 `--debug`，则使用基本调试。如果调试选项为 `-d`，则使用 all。要选择其他选项的组合，使用逗号分隔的列表 `--debug=option1,option2`，其中选项可以是以下单词之一(实际上，make 只看第一个字母):

#### basic

basic 调试是最不详细的。启用时，make 将打印发现的每个过时的目标和更新操作的状态。示例输出如下所示:

```text
File all does not exist.
    File app/player/play_mp3 does not exist.
        File app/player/play_mp3.o does not exist.
    Must remake target app/player/play_mp3.o.
gcc ... ../mp3_player/app/player/play_mp3.c
    Successfully remade target file app/player/play_mp3.o.
```

#### verbose

此选项设置基本选项，并包含关于哪些文件被解析、不需要重新构建的先决条件等附加信息:

```text
    File all does not exist.
        Considering target file app/player/play_mp3.
            File app/player/play_mp3 does not exist.
                Considering target file app/player/play_mp3.o.
                File app/player/play_mp3.o does not exist.
                    Pruning file ../mp3_player/app/player/play_mp3.c.
                    Pruning file ../mp3_player/app/player/play_mp3.c.
                    Pruning file ../mp3_player/include/player/play_mp3.h.
                Finished prerequisites of target file app/player/play_mp3.o.
        Must remake target app/player/play_mp3.o.
gcc ... ../mp3_player/app/player/play_mp3.c
    Successfully remade target file app/player/play_mp3.o.
    Pruning file app/player/play_mp3.o.
```

#### implicit

此选项设置基本选项，并包含关于每个目标的隐式规则搜索的附加信息:

```text
File all does not exist.
    File app/player/play_mp3 does not exist.
    Looking for an implicit rule for app/player/play_mp3.
    Trying pattern rule with stem play_mp3.
    Trying implicit prerequisite app/player/play_mp3.o.
    Found an implicit rule for app/player/play_mp3.
    File app/player/play_mp3.o does not exist.
    Looking for an implicit rule for app/player/play_mp3.o.
    Trying pattern rule with stem play_mp3.
    Trying implicit prerequisite app/player/play_mp3.c.
    Found prerequisite app/player/play_mp3.c as VPATH ../mp3_player/app/player/
play_mp3.c
    Found an implicit rule for app/player/play_mp3.o.
    Must remake target app/player/play_mp3.o.
gcc ... ../mp3_player/app/player/play_mp3.c
    Successfully remade target file app/player/play_mp3.o.
```

#### jobs

该选项打印 make 调用的子流程的详细信息。它不启用基本选项。

```text
Got a SIGCHLD; 1 unreaped children.
gcc ... ../mp3_player/app/player/play_mp3.c
Putting child 0x10033800 (app/player/play_mp3.o) PID 576 on the chain.
Live child 0x10033800 (app/player/play_mp3.o) PID 576
Got a SIGCHLD; 1 unreaped children.
Reaping winning child 0x10033800 PID 576
Removing child 0x10033800 PID 576 from chain.
```

#### all

这将启用前面的所有选项，并且是使用 -d 选项时的默认选项。

#### makefile

一般情况下，调试信息在更新 makefile 后才会打开。这包括更新任何包含的文件，比如依赖项列表。当您使用此修饰符时，make 将在重新生成 makefile 和包含文件时打印选定的信息。此选项启用基本选项，也由 all 选项启用。

## 编写调试代码

如您所见，调试 makefile 的工具并不多，只有几种转储 make 内部数据结构的方法和一些 print 语句。当问题出现时，您可以自行编写 makefile，以减少错误发生的机会，或者提供您自己的脚手架来帮助调试它们。

本节中的建议作为编码实践、防御性编码和调试技术进行了随意的安排。虽然检查命令退出状态等具体项目可以放在良好编码实践部分或防御性编码部分，但这三个类别反映了适当的偏差。专注于编写makefile，而不需要裁剪太多的角落。包含大量的防御编码，以保护makefile不受意外事件和环境条件的影响。最后，当bug出现时，使用所有你能找到的方法来消灭它们。

“保持简单”原则(<http://www.catb.org/~esr/jargon/html/K/KISSPrinciple.html>)是所有优秀设计的核心。正如你在前几章所看到的，makefile 可以很快变得复杂，甚至对于普通的任务，如依赖生成。不要在构建系统中包含越来越多的特性。你会失败，但如果你只是简单地包含所有你想到的功能，那就不会失败得那么严重。

### 良好的编码规范

根据我的经验，大多数程序员并不认为编写 makefile 是编程，因此，他们不像编写 C++ 或 Java 那样小心。但是 make 语言是一种完全的非过程语言。如果构建系统的可靠性和可维护性很重要，那么请小心地编写它，并尽可能使用最佳的编码实践。

编写健壮的 makefile 最重要的方面之一是检查命令的返回状态。当然，make 会自动检查简单的命令，但 makefile 通常包含复合命令，这些命令可能会悄然失败:

```makefile
do:
    cd i-dont-exist; \
    echo *.c
```

当运行时，这个 makefile 不会以一个错误状态结束，尽管一个错误肯定会发生:

```text
$ make
cd i-dont-exist; \
echo *.c
/bin/sh: line 1: cd: i-dont-exist: No such file or directory
*.c
```

此外，通配符表达式无法找到任何 `.c` 文件，因此它悄悄地返回通配符表达式。哦。编写这个命令脚本的更好方法是使用 shell 的特性来检查和防止错误:

```makefile
SHELL = /bin/bash
do:
    cd i-dont-exist && \
    shopt -s nullglob &&
    echo *.c
```

现在 cd 错误被正确传输到 make, echo 命令永远不会执行，make 以错误状态终止。此外，如果没有找到文件，设置 bash 的nullglob 选项将导致抓取模式返回空字符串。(当然，您的特定应用程序可能更喜欢抓取模式。)

```text
$ make
cd i-dont-exist && \
echo *.c
/bin/sh: line 1: cd: i-dont-exist: No such file or directory
make: *** [do] Error 1
```

另一个好的编码实践是格式化你的代码以达到最大的可读性。我看到的大多数 makefile 格式都很糟糕，因此很难阅读。你觉得哪个更容易读?

```makefile
_MKDIRS := $(shell for d in $(REQUIRED_DIRS); do [[ -d $$d \
]] || mkdir -p $$d; done)
```

or:

```makefile
_MKDIRS := $(shell                          \
        for d in $(REQUIRED_DIRS);          \
        do                                  \
            [[ -d $$d ]] || mkdir -p $$d;   \
        done)
```

如果您和大多数人一样，您会发现第一个语句更难解析，分号更难查找，语句的数量更难计数。这些都不是无关紧要的问题。在命令脚本中遇到的语法错误很大一部分是由于缺少分号、反斜杠或其他分隔符(如管道和逻辑操作符)造成的。

另外，注意不是所有缺少的分隔符都会产生错误。例如，以下错误都不会产生shell语法错误:

```makefile
TAGS:
    cd src \
    ctags --recurse

disk_free:
    echo "Checking free disk space..." \
    df . | awk '{ print $$4 }'
```

为了可读性而设置的格式化命令将使这类错误更容易捕获。当格式化用户定义函数时，缩进代码。有时，由此产生的宏展开中的额外空间会导致问题。如果是，则将格式化封装在 `strip` 函数调用中。当格式化长值列表时，将每个值单独放在一行中。在每个目标之前添加注释，给出简要解释，并记录参数列表。

下一个好的编码实践是自由使用变量来保存共同的值。正如在任何程序中一样，无限制地使用文字值会造成代码重复，并导致维护问题和bug。变量的另一个巨大优势是，您可以使用make在执行期间显示它们，以便进行调试。在本章后面的“调试技术”一节中，我展示了一个很好的命令行界面。

### 防御性编程

防御代码是只有当您的假设或期望之一出错时才能执行的代码——如果测试永远不会为真，assert函数永远不会失败，或者跟踪代码。当然，这些从未执行过的代码的价值在于，偶尔(通常是在您最不希望执行的时候)，它会运行并产生一个警告或错误，或者您可以选择启用跟踪代码，以便查看 make 的内部工作情况。

您已经在其他上下文中见过这段代码的大部分，但是为了方便起见，这里将重复它。

验证检查是防御代码的一个很好的例子。这个代码示例验证了make当前执行的版本是3.80:

```makefile
NEED_VERSION := 3.80
$(if $(filter $(NEED_VERSION),$(MAKE_VERSION)),, \
    $(error You must be running make version $(NEED_VERSION).))
```

对于 Java 应用程序，在 CLASSPATH 中包含对文件的检查是很有用的。

验证代码还可以简单地确保某些内容是正确的。上一节中的目录创建代码就是这种性质的。

另一种很好的防御编码技术是使用第4章“流控制”一节中定义的断言函数。以下是几个版本:

```makefile
# $(call assert,condition,message)
define assert
    $(if $1,,$(error Assertion failed: $2))
endef

# $(call assert-file-exists,wildcard-pattern)
define assert-file-exists
    $(call assert,$(wildcard $1),$1 does not exist)
endef

# $(call assert-not-null,make-variable)
define assert-not-null
    $(call assert,$($1),The variable "$1" is null)
endef
```

我发现，在 makefile 周围零星地调用断言是一种廉价而有效的方法，可以检测缺少和拼写错误的参数以及违反其他假设。

在第四章中，我们编写了一对函数来跟踪用户定义函数的展开:

```makefile
# $(debug-enter)
debug-enter = $(if $(debug_trace),\
    $(warning Entering $0($(echo-args))))

# $(debug-leave)
debug-leave = $(if $(debug_trace),$(warning Leaving $0))

comma := ,
echo-args = $(subst ' ','$(comma) ',\
    $(foreach a,1 2 3 4 5 6 7 8 9,'$($a)'))
```

您可以将这些宏调用添加到您自己的函数中，并将它们禁用，直到需要调试它们时才启用。要启用它们，请将 debug_trace 设置为任何非空值:

```text
$ make debug_trace=1
```

正如第四章所指出的，这些跟踪宏本身有许多问题，但在跟踪 bug 时仍然很有用。

最后一种防御性编程技术是通过一个 make 变量来简单地禁用 `@` 命令修饰符，而不是按字面意思:

```makefile
QUIET := @
…
target:
    $(QUIET) some command
```

使用这种技术，你可以通过在命令行上重新定义 `QUIET` 来看到静默命令的执行:

```text
$ make QUIET=
```

### 调试技术

本节讨论一般的调试技术和问题。最后，调试是对您的情况起作用的任何东西的集合。这些技术对我很有效，我已经开始依赖它们来调试最简单的 makefile 问题。也许他们也会帮你。

在 3.80 中一个非常恼人的 bug 是，当 make 在 makefile 中报告问题并包含行号时，我通常会发现行号是错误的。我还没有调查问题是由于包括文件，多行变量赋值，或用户定义的宏，但它是。通常报表的行号大于实际的行号。在复杂的 makefile 中，我已经让行号偏离了多达20行。

通常，查看 make 变量值的最简单方法是在目标执行期间打印它。虽然使用 warning 添加打印语句很简单，但是为打印变量添加通用调试目标的额外工作从长远来看可以节省大量时间。下面是一个示例调试目标:

```makefile
debug:
    $(for v,$(V), \
        $(warning $v = $($v)))
```

要使用它，只需在命令行中设置要打印的变量列表，并包含调试目标:

```text
$ make V="USERNAME SHELL" debug
makefile:2: USERNAME = Owner
makefile:2: SHELL = /bin/sh.exe
make: debug is up to date.
```

如果你想变得更复杂，你可以使用 `MAKECMDGOALS` 变量来避免对变量 `V` 的赋值:

```makefile
debug:
    $(for v,$(V) $(MAKECMDGOALS), \
        $(if $(filter debug,$v),,$(warning $v = $($v))))
```

现在您可以通过在命令行中列出变量来打印变量。但我不推荐这种技术，因为你也会得到令人困惑的警告，表明它不知道如何更新变量(因为它们被列为目标):

```text
$ make debug PATH SHELL
makefile:2: USERNAME = Owner
makefile:2: SHELL = /bin/sh.exe
make: debug is up to date.
make: *** No rule to make target USERNAME. Stop.
```

在第十章中，我简要提到了使用调试 shell 来帮助理解幕后执行的一些活动。在命令脚本中执行命令之前，make 会回显命令，但在 shell 函数中执行的命令不会回显。这些命令通常是微妙而复杂的，特别是因为如果它们发生在递归变量赋值中，它们可以立即执行或以延迟的方式执行。查看这些命令执行的一种方法是请求子 shell 启用调试打印:

```makefile
DATE := $(shell date +%F)
OUTPUT_DIR = out-$(DATE)

make-directories := $(shell [ -d $(OUTPUT_DIR) ] || mkdir -p $(OUTPUT_DIR))

all: ;
```

当使用 sh 的调试选项运行时，我们会看到:

```text
$ make SHELL="sh -x"
+ date +%F
+ '[' -d out-2004-05-11 ']'
+ mkdir -p out-2004-05-11
```

这甚至提供了除了 make 警告语句之外的其他调试信息，因为使用这个选项，shell 还会显示变量和表达式的值。

本书中的许多例子都是作为深度嵌套的表达式编写的，比如下面这个在 Windows/Cygwin 系统中检查 PATH 变量的例子:

```makefile
$(if $(findstring /bin/,                                \
    $(firstword                                         \
        $(wildcard                                      \
            $(addsuffix /sort$(if $(COMSPEC),.exe),     \
                $(subst :, ,$(PATH)))))),,              \
$(error Your PATH is wrong, c:/usr/cygwin/bin should    \
    precede c:/WINDOWS/system32))
```

没有调试这些表达式的好方法。一个合理的方法是展开它们，打印每个子表达式:

```makefile
$(warning $(subst :, ,$(PATH)))
$(warning /sort$(if $(COMSPEC),.exe))
$(warning $(addsuffix /sort$(if $(COMSPEC),.exe), \
    $(subst :, ,$(PATH))))

$(warning $(wildcard                        \
    $(addsuffix /sort$(if $(COMSPEC),.exe), \
    $(subst :, ,$(PATH)))))
```

虽然有点繁琐，但是没有真正的调试器，这是确定各种子表达式值的最佳方法(有时是唯一的方法)。

## 公共错误消息

GNU make 3.81 手册包含了一个很好的部分，其中列出了 make 错误消息及其原因。我们在这里回顾一些最常见的。这里描述的一些问题严格来说并不会导致错误，比如命令脚本中的语法错误，但对于开发人员来说却是常见的问题。有关错误的完整列表，请参阅 make 手册。

make打印的错误信息有一个标准格式:

```text
makefile:n: *** message. Stop.
```

或者:

```text
make:n: *** message. Stop.
```

makefile 部分是发生错误的 makefile 或包含文件的名称。下一部分是发生错误的行号，后面是三个星号，最后是错误消息。

请注意，make 的任务是运行其他程序，如果发生错误，很可能 makefile 中的问题将显示为这些其他程序中的错误。例如，shell 错误可能由格式糟糕的命令脚本或错误的命令行参数导致的编译器错误引起。找出产生错误消息的程序是解决这个问题的第一个任务。幸运的是，make 的错误消息是相当明显的。

### 语法错误

这些通常是排版错误:缺少括号，使用空格代替制表符，等等。

make 新用户最常见的错误之一是在变量名周围省略括号:

```makefile
foo:
    for f in $SOURCES;  \
    do                  \
        …               \
    done
```

这可能会导致 `$S` 展开为空，`shell` 只执行一次循环，其中 `f` 的值为 `OURCES`。取决于你对 f 做了什么，你可能会得到一个很好的 `shell` 错误消息，比如:

```text
OURCES: No such file or directory
```

但你可能也很容易得不到任何信息。记住要用圆括号括住 make 变量。

---

忘记分隔符

消息:

```text
makefile:2:missing separator. Stop.
```

或者：

```text
makefile:2:missing separator (did you mean TAB instead of 8 spaces?). Stop.
```

通常意味着您有一个使用空格而不是制表符的命令脚本。更字面的解释是，make 查找 make 分隔符，例如 `:`, `=` 或制表符，但没有找到。相反，它发现了一些它不理解的东西。

---

命令在第一个目标之前开始

tab字符再次出现!

这个错误消息首先在第5章的“解析命令”一节中介绍。当命令脚本外的行以制表符开头时，这个错误似乎最经常出现在 makefile 中间。make 尽力消除这种情况的歧义，但是如果该行不能被标识为变量赋值、条件表达式或多行宏定义，make 会认为它是一个错位的命令。

---

未结束的变量引用

这是一个简单但常见的错误。这意味着您未能关闭带有适当数量圆括号的变量引用或函数调用。通过深度嵌套的函数调用和变量引用，make 文件开始看起来像 Lisp! 进行括号匹配的好的编辑器(如Emacs)是避免这些类型错误的最可靠的方法。

---

### 命令脚本错误

在命令脚本中有三种常见的错误类型:多行命令中缺少分号、路径变量不完整或不正确、或者命令在运行时遇到问题。

我们在“良好的编码实践”一节中讨论了缺少分号的问题，所以在这里不再详细说明。

经典的错误信息:

```text
bash: foo: command not found
```

当 shell 无法找到 foo 命令时显示。也就是说，shell 已经在 PATH 变量中的每个目录中搜索可执行文件，但没有找到匹配的。要纠正这个错误，必须更新 PATH 变量，通常是在 `.profile` (Bourne shell)、`.bashrc` (bash)或 `.cshrc` (C shell)中。当然，也可以在 makefile 本身中设置 PATH 变量，并从 make 中导出 PATH 变量。

最后，当shell命令失败时，它将以一个非零退出状态终止。在这种情况下，用以下消息报告失败:

```text
$ make
touch /foo/bar
touch: creating /foo/bar: No such file or directory
make: *** [all] Error 1
```

这里失败的命令是 touch，它打印自己的错误消息来解释失败。下一行是 make 对错误的总结。失败的 makefile 目标显示在方括号中，后面是失败程序的退出值。有时，如果程序由于一个信号而退出，而不是简单的一个非零退出状态，make 将打印更详细的消息。

还要注意，使用 `@` 修饰符静默执行的命令也可能失败。在这些情况下，出现的错误消息可能看起来像是来自任何地方。

在这两种情况中，错误产生于正在运行的程序make，而不是make本身。

### 目标没有设定规则

这个消息有两种形式:

```text
make: *** No rule to make target XXX. Stop.
```

和:

```text
make: *** No rule to make target XXX, needed by YYY. Stop.
```

这意味着 make 决定需要更新文件 XXX，但 make 无法找到执行该任务的任何规则。make 将在放弃并打印消息之前搜索其数据库中的所有隐式和显式规则。

这个错误可能有三个原因:

- 你的 makefile 缺少一个更新文件所需的规则。在这种情况下，您必须添加描述如何构建目标的规则。

- makefile 中有一个打印错误。make 查找错误的文件，或者更新文件的规则指定了错误的文件。由于使用 make 变量，在 makefile 中很难找到拼写错误。有时，真正确定复杂文件名值的唯一方法是直接打印变量或检查 make 的内部数据库将其打印出来。

- 文件应该存在，但 make 也找不到它，因为它丢失了，或者因为make不知道去哪里找。当然，有时候做是绝对正确的。该文件丢失了—可能您忘记将其检出 CVS。更常见的情况是，make 找不到文件，因为源文件被放在了其他地方。有时源文件在一个单独的源树中，或者文件是由另一个程序生成的，而生成的文件在二叉树中。

### 覆盖目标的命令

make 只允许一个目标使用一个命令脚本(很少使用双冒号规则除外)。如果一个目标有多个命令脚本，make 打印警告:

```text
makefile:5: warning: overriding commands for target foo
```

它同样可以显示警告:

```text
makefile:2: warning: ignoring old commands for target foo
```

第一个警告指示找到第二个命令脚本的行，而第二个警告指示被覆盖的原始命令脚本的位置。

在复杂的 makefile 中，通常多次指定目标，每个目标都添加自己的依赖。其中一个目标通常包括一个命令脚本，但是在开发或调试期间很容易添加另一个命令脚本，而不知道您实际上是在覆盖现有的命令集。

例如，可以在 `include` 文件中定义一个泛型目标:

```makefile
# Create a jar file.
$(jar_file):
    $(JAR) $(JARFLAGS) -f $@ $^
```

并允许几个单独的 makefile 添加它们自己的先决条件。然后在 makefile 中我们可以写:

```makefile
# Set the target for creating the jar and add prerequisites
jar_file = parser.jar
$(jar_file): $(class_files)
```

如果我们无意中向这个 makefile 文本添加了一个命令脚本，make 将产生覆盖警告。

## 参考资料

- [Managing Projects with GNU Make](https://book.douban.com/subject/1850994/)
