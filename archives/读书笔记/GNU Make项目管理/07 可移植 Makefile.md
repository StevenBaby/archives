# GNU Make 项目管理 第七章 可移植 Makefile

[annotation]: [id] (0e8c3ad6-c989-4ed5-8dec-eb535bc0352f)
[annotation]: [status] (public)
[annotation]: [create_time] (2021-04-18 19:20:06)
[annotation]: [category] (读书笔记)
[annotation]: [tags] (Make|Makefile|GNU)
[annotation]: [topic] (GNU Make 项目管理)
[annotation]: [index] (7)
[annotation]: [comments] (true)
[annotation]: [url] (http://blog.ccyg.studio/article/0e8c3ad6-c989-4ed5-8dec-eb535bc0352f)

可移植 makefile 是什么意思？作为一个极端的例子，我们想要一个在任何可运行 GNU make 的系统上都不需要更改的执行 makefile。但由于操作系统的多样性，这实际上是不可能的。更合理的解释是 makefile，它很容易针对运行它的每个新平台进行更改。一个重要的附加约束是，到新系统的移植不会破坏对以前平台的支持。

我们可以使用与传统编程相同的技术来实现 makefile 的这种级别的可移植性:封装和抽象。通过使用变量和自定义函数，我们可以封装应用程序和算法。通过为命令行参数和形参定义变量，我们可以从常量中抽象出因平台而异的元素。

然后，您必须确定每个平台提供什么工具来完成您的工作，以及每个平台可以使用什么工具。可移植性的极限是只使用那些存在于所有感兴趣的平台上的工具和特性。这通常被称为“最小公分母”方法，显然会留给您非常原始的功能。

最小公分方法的另一个版本是选择一组功能强大的工具，并确保将其带到每个平台，从而确保您在 makefile 中调用的命令在任何地方都完全相同。这可能很难实现，无论是在管理方面，还是在让您的组织配合您摆弄他们的系统方面。但是它可以成功，稍后我将使用用于 Windows 的 Cygwin 包来展示这方面的一个例子。正如您将看到的，对工具进行标准化并不能解决所有问题，操作系统总是存在差异需要处理。

最后，您可以接受系统之间的差异，并通过仔细选择宏和函数来处理它们。我也将在本章中展示这种方法。

因此，通过明智地使用变量和用户定义的函数，并通过尽量减少使用外来特性和依赖标准工具，我们可以提高 makefile 的可移植性。正如前面提到的，没有完美的可移植性这种东西，所以我们的工作是平衡工作与可移植性。但是在我们探讨特定的技术之前，让我们回顾一下可移植 makefile 的一些问题。

## 移植性问题

可移植性问题可能很难描述，因为它们跨越了整个范围，从一个完整的范式转换(比如传统的 Mac OS VS System V Unix) 到几乎微不足道的 bug 修复(比如修复程序错误退出状态中的 bug)。然而，下面是每个 makefile 迟早都必须处理的一些常见的可移植性问题:

### 程序名称

不同的平台对相同或类似的程序使用不同的名称是很常见的。最常见的是 C 或 C++ 编译器的名称(例如，cc, xlc)。在非 GNU 系统上安装带有 g 前缀的 GNU 版本的程序也很常见(例如，gmake、gawk)。

### 路径

程序和文件的位置经常因平台而异。例如，在 Solaris 系统上，X目录存储在 `/usr/X` 下，而在许多其他系统上，路径是 `/usr/X11R6`，此外，当您从一个系统转移到另一个系统时，`/bin`、`/usr/bin`、`/sbin` 和 `/usr/sbin` 之间的区别通常相当模糊。

### 选项

程序的命令行选项各不相同，特别是在使用替代实现时。此外，如果一个平台缺少一个实用程序或带有一个破损的版本，您可能需要用另一个使用不同命令行选项的实用程序替换该实用程序。

### Shell 特性

默认情况下，make 使用 `/bin/sh` 执行命令脚本，但是 sh 实现的特性差别很大。特别是，POSIX 之前的 shell 缺少许多特性，并且不能接受与现代 shell 相同的语法。Open Group 有一份关于 System V shell 和 POSIX shell 之间区别的非常有用的白皮书。可以在 <http://www.unix-systems.org/whitepapers/shdiffs.html> 上找到。如果想了解更多细节，可以在 <http://www.opengroup.org/onlinepub/007904975/utilities/xcu_chap02.html> 上找到POSIX shell 命令语言的规范。

> 以上两个页面应该已经丢失

### 程序行为

可移植的 makefile 必须与行为不同的程序遭遇。这是非常常见的，因为不同的供应商修复或植入错误和添加功能。还有一些对实用程序的升级，这些升级可能已经被厂商发布了，也可能没有。例如，在 1987 年 awk 程序经历了一次重大的修订。近20年后，一些系统仍然没有将这个升级版本作为标准 awk 安装。

### 操作系统

最后，还有与完全不同的操作系统(如 Windows 与 Unix 或 Linux 与 VMS)相关的可移植性问题。

## Cygwin

虽然 make 有一个本地 Win32 端口，但这只是 Windows 可移植性问题的一小部分，因为这个本地端口使用的外壳是 `cmd.exe`。这一点，再加上大多数 Unix 工具的缺乏，使得跨平台的可移植性成为一项艰巨的任务。幸运的是，Cygwin项目(<http://www.cygwin.com>)已经为 Windows 构建了一个与 Linux 兼容的库，许多程序都被移植到这个库中。对于希望与 Linux 兼容或使用 GNU 工具的 Windows 开发人员来说，我认为没有更好的工具了。

> 我的 Cygwin /bin 目录目前包含 1343 个可执行文件。

从 C++/Lisp CAD 应用到纯 Java 工作流管理系统，我在各种项目中使用 Cygwin 已经超过 10 年了。Cygwin 工具集包括许多编程语言的编译器和解释器。然而，即使应用程序本身是使用非 Cygwin 编译器和解释器实现的，Cygwin 也可以被有益地使用。Cygwin 工具集只能作为协调开发和构建过程的辅助工具。换句话说，没有必要编写“Cygwin”应用程序或使用 Cygwin 语言工具来获得 Cygwin 环境的好处。

然而，Linux 不是 Windows(谢天谢地!)，当将 Cygwin 工具应用到本机 Windows 应用程序时，会出现一些问题。几乎所有这些问题都与文件中使用的行结束符以及 Cygwin 和 Windows 之间传递的路径形式有关。

### 行终止符

Windows 文件系统使用两个字符序列回车后跟换行(或CRLF)来终止文本文件的每行。POSIX 系统使用单个字符，换行符(LF或换行符)。偶尔，这种差异会导致程序报告语法错误或查找数据文件中的错误位置时的一些混乱。然而，Cygwin 库在解决这些问题方面做得非常好。安装 Cygwin 时(或者使用 mount 命令时)，您可以选择 Cygwin 是否应该翻译以 CRLF 结尾的文件。如果选择了 DOS 文件格式，Cygwin 在读取文本文件时会将 CRLF 转换为 LF，在写入文本文件时会将 CRLF 转换为 LF，这样基于 Unix 的程序就可以正确处理 DOS 文本文件。如果您计划使用原生语言工具，如 Visual C++ 或 Sun 的 Java SDK，请选择 DOS 文件格式。如果您打算使用 Cygwin 编译器，请选择 Unix。(您的选择可以在任何时候更改。)

此外，Cygwin 还提供了显式翻译文件的工具。实用程序 dos2unix 和 unix2dos 在必要时转换文件的行结束符。

### 文件系统

Cygwin 提供了 Windows 文件系统的 POSIX 视图。POSIX 文件系统的根目录为 “/”，对应安装 Cygwin 的目录。Windows 驱动器可以通过伪目录 /cygdrive/字母访问。因此，如果 Cygwin 安装在 `C:\usr\Cygwin` (我的首选位置)中，表 7-1 所示的目录映射将保持不变。

表 7-1 默认 Cygwin 目录映射

| 原生 Windows 路径 | Cygwin 路径               | 可选 Cygwin 路径           |
| ----------------- | ------------------------- | -------------------------- |
| C:\usr\cygwin     | /                         | /cygdrive/c/usr/cygwin     |
| C:\Program Files  | /cygdrive/c/Program Files |
| C:\usr\cygwin\bin | /bin                      | /cygdrive/c/usr/cygwin/bin |

这在一开始可能有点令人困惑，但不会对工具造成任何问题。Cygwin 还包括一个挂载命令，允许用户更方便地访问文件和目录。挂载的一个选项 `--change-cygdrive-prefix` 允许您更改前缀。我发现将前缀改为简单 `/` 特别有用，因为驱动器号可以被更自然地访问:

```text
$ mount --change-cygdrive-prefix /
$ ls /c
AUTOEXEC.BAT            Home            Program Files               hp
BOOT.INI                I386            RECYCLER                    ntldr
CD                      IO.SYS          System Volume Information   pagefile.sys
CONFIG.SYS              MSDOS.SYS       Temp                        tmp
C_DILLA                 NTDETECT.COM    WINDOWS                     usr
Documents and Settings  PERSIST         WUTemp                      work
```

一旦进行了此更改，我们之前的目录映射将更改为表 7-2 所示的目录映射。

表 7-2 更改的 Cygwin 目录映射

| 原生 Windows 路径 | Cygwin 路径      | 可选 Cygwin 路径  |
| ----------------- | ---------------- | ----------------- |
| C:\usr\cygwin     | /                | /c/usr/cygwin     |
| C:\Program Files  | /c/Program Files |                   |
| C:\usr\cygwin\bin | /bin             | /c/usr/cygwin/bin |

如果您需要将文件名传递给 Windows 程序，比如 Visual C++ 编译器，您通常可以使用 POSIX 风格的正斜杠传递文件的相对路径。Win32 API 不区分向前斜杠和向后斜杠。不幸的是，一些执行自己的命令行参数解析的实用程序将所有正斜杠视为命令选项。一个这样的工具是 `DOS` 打印命令;另一个是 `net` 命令。

如果使用绝对路径，驱动器号语法总是一个问题。尽管 Windows 程序通常可以使用斜杠，但它们完全无法理解 `/c` 语法。驱动器号必须始终转换回 `C:`。为了实现这一点和 正/反斜杠 转换，Cygwin 提供了 cygpath 实用程序来在 POSIX 路径和 Windows 路径之间进行转换。

```text
$ cygpath --windows /c/work/src/lib/foo.c
c:\work\src\lib\foo.c
$ cygpath --mixed /c/work/src/lib/foo.c
c:/work/src/lib/foo.c
$ cygpath --mixed --path "/c/work/src:/c/work/include"
c:/work/src;c:/work/include
```

`--windows` 选项将命令行上给出的 POSIX 路径转换为 Windows 路径(或者使用适当的参数反过来)。我更喜欢使用 `--mixed` 选项，它产生一个 Windows 路径，但是使用正斜杠而不是反斜杠(当 Windows 实用程序接受它时)。这在 Cygwin shell 中表现得更好，因为反斜杠是转义字符。cygpath 实用程序有许多选项，其中一些提供了对重要 Windows 路径的可移植访问:

```text
$ cygpath --desktop
/c/Documents and Settings/Owner/Desktop
$ cygpath --homeroot
/c/Documents and Settings
$ cygpath --smprograms
/c/Documents and Settings/Owner/Start Menu/Programs
$ cygpath --sysdir
/c/WINDOWS/SYSTEM32
$ cygpath --windir
/c/WINDOWS
```

如果你在混合 Windows/Unix 环境中使用 cygpath，你会想要将这些调用包装在一个可移植的函数中:

```makefile
ifdef COMSPEC
    cygpath-mixed = $(shell cygpath -m "$1")
    cygpath-unix = $(shell cygpath -u "$1")
    drive-letter-to-slash = /$(subst :,,$1)
else
    cygpath-mixed = $1
    cygpath-unix = $1
    drive-letter-to-slash = $1
endif
```

如果您需要做的只是将 C: 驱动器号语法映射到 POSIX 形式，那么 `drivelletter-to-slash` 函数比运行 cygpath 程序更快。

最后，Cygwin 无法隐藏 Windows 的所有怪癖。在 Windows 中无效的文件名在 Cygwin 中也是无效的。因此，诸如 aux.h、com1 和 prn 等名称不能在 POSIX 路径中使用，即使具有扩展名。

### 程序冲突

有些 Windows 程序的名称与 Unix 程序相同。当然，Windows 程序不接受相同的命令行参数，也不以与 Unix 程序兼容的方式运行。如果您不小心调用了 Windows 版本，通常的结果是非常混乱。最麻烦的似乎是 `find`、`sort`、`ftp` 和 `telnet`。为了获得最大的可移植性，在 Unix、Windows 和 Cygwin 之间移植时，应该确保提供这些程序的完整路径。

如果您对 Cygwin 非常忠诚，并且不需要使用本机 Windows 支持工具进行构建，那么您可以安全地将 Cygwin /bin 目录放置在 Windows 环境变量路径的前面。这将保证在Windows 版本上访问 Cygwin 工具。

如果您的 makefile 使用的是 Java 工具，请注意 Cygwin 包含的 GNU jar 程序与标准的 Sun jar 文件格式不兼容。因此，Java jdk 的 bin 目录应该放在Path 变量的 Cygwin /bin 目录之前，以避免使用 Cygwin 的 jar 程序。

## 管理程序和文件

管理程序最常见的方法是为可能更改的程序名或路径使用一个变量。这些变量可以在一个简单的块中定义，如你所见:

```makefile
MV ?= mv -f
RM ?= rm -f
```

or in a conditional block:

```makefile
ifdef COMSPEC
    MV ?= move
    RM ?= del
else
    MV ?= mv -f
    RM ?= rm -f
endif
```

如果使用一个简单的块，则可以通过在命令行上重置它们、编辑 makefile 或通过设置环境变量(在本例中，因为我们使用了条件赋值，即 ?=)来更改值。如前所述，测试Windows 平台的一种方法是检查 COMSPEC 变量，所有 Windows 操作系统都使用 COMSPEC 变量。有时候只需要改变路径:

```makefile
ifdef COMSPEC
    OUTPUT_ROOT := d:
    GCC_HOME := c:/gnu/usr/bin
else
    OUTPUT_ROOT := $(HOME)
    GCC_HOME := /usr/bin
endif

OUTPUT_DIR := $(OUTPUT_ROOT)/work/binaries
CC := $(GCC_HOME)/gcc
```

这种风格会产生一个 makefile，在这个 makefile 中，大多数程序都是通过 make 变量调用的。在您习惯之前，这可能会使 makefile 有点难以阅读。但是，变量通常在 makefile 中使用更方便，因为它们可以比程序字面名称短得多，特别是在使用完整路径时。

同样的技术可以用于管理不同的命令选项。例如，内置编译规则包括一个变量 `TARGET_ARCH`，可以用来设置特定于平台的标志:

```makefile
ifeq "$(MACHINE)" "hpux-hppa"
    TARGET_ARCH := -mdisable-fpregs
endif
```

当定义你自己的程序变量时，你可能需要使用类似的方法:

```makefile
MV := mv $(MV_FLAGS)

ifeq "$(MACHINE)" "solaris-sparc"
    MV_FLAGS := -f
endif
```

如果您要移植到许多平台，将 `ifdef` 部分链接起来可能会变得丑陋和难以维护。与其使用 `ifdef`，不如将每个特定于平台的变量集放在其名称包含一个平台指示符的文件中。例如，如果你通过 `uname` 参数指定一个平台，你可以选择适当的 make include 文件，如下所示:

```makefile
MACHINE := $(shell uname -smo | sed 's/ /-/g')
include $(MACHINE)-defines.mk
```

带有空格的文件名给 make 带来了一个特别恼人的问题。在解析过程中使用空格分隔标记的假设是基本的。许多内置函数，如 `word`、`filter`、`wildcard` 等，都假定它们的参数是空格分隔的单词。尽管如此，这里有一些小技巧可能会有所帮助。第一个技巧，在第八章“支持多个二叉树”一节中提到，是如何使用 subst 替换空格:

```makefile
space = $(empty) $(empty)

# $(call space-to-question,file-name)
space-to-question = $(subst $(space),?,$1)
```

`space-to-question` 函数用通配符问号替换所有空格。现在，我们可以使用 `wildcard` 和 `file-exists` 函数来处理空格:

```makefile
# $(call wildcard-spaces,file-name)
wildcard-spaces = $(wildcard $(call space-to-question,$1))

# $(call file-exists
file-exists = $(strip                                \
                $(if $1,,$(warning $1 has no value)) \
                $(call wildcard-spaces,$1))
```

`wildcard-spaces` 函数使用 `space-to-question` 来允许 makefile 对包含空格的模式执行通配符操作。我们可以使用 `wildcard-spaces` 函数来实现文件存在。当然，问号的使用也可能导致 `wildcard-spaces` 返回与原始通配符模式不正确匹配的文件(例如，"my document.doc" 和 "my-document.doc")，但这是我们已经尽力了。

`space-to-question` 函数还可以用于转换目标和依赖中带有空格的文件名，因为这些文件名允许使用模式抓取。

```makefile
space := $(empty) $(empty)

# $(call space-to-question,file-name)
space-to-question = $(subst $(space),?,$1)

# $(call question-to-space,file-name)
question-to-space = $(subst ?,$(space),$1)

$(call space-to-question,foo bar): $(call space-to-question,bar baz)
    touch "$(call question-to-space,$@)"
```

假设文件“bar baz”存在，那么第一次执行这个 makefile 时就会找到依赖，因为会计算抓取模式。但是目标通配符模式失败了，因为目标还不存在，所以 `$@` 的值是`foo?bar`。然后，命令脚本使用 `question-to-space` 将 `$@` 转换回具有我们真正需要的空格的文件。下一次运行 makefile 时，会找到目标，因为抓取模式会用空格找到目标。虽然有点难看，但我发现这些技巧在真正的 makefile 中很有用。

## 源代码树层次

可移植性的另一个方面是允许开发人员自由地管理他们认为必要的开发环境。例如，如果构建系统要求开发人员始终将他们的源代码、二进制文件、库和支持工具放在相同的目录下或相同的 Windows 磁盘驱动器上，那么就会出现问题。最终，一些磁盘空间不足的开发人员将面临必须对这些不同文件进行分区的问题。

相反，使用变量来引用这些文件集合并设置合理的默认值来实现 makefile 是有意义的。此外，每个支持库和工具都可以通过一个变量引用，以允许开发人员根据需要定制文件位置。对于最有可能的自定义变量，使用条件赋值操作符允许开发人员使用环境变量覆盖 makefile 的简单方法。

此外，轻松支持源代码和二叉树的多个副本的能力对开发人员来说是一个福音。即使他们不需要支持不同的平台或编译选项，开发人员也经常发现自己要使用源代码的多个副本，这可能是出于调试目的，也可能是因为他们要并行地处理多个项目。支持这一点的两种方法已经讨论过了: 使用“顶级”环境变量来标识源和二叉树的根，或者使用 makefile 的目录和固定的相对路径来查找二叉树。这两种方法都允许开发人员支持多个树的灵活性。

## 使用不可移植的工具

如前所述，编写 makefile 的另一种方法是采用一些标准工具。当然，我们的目标是确保标准工具至少与您正在构建的应用程序一样具有可移植性。可移植工具的明显选择是来自 GNU 项目的程序，但是可移植工具来自各种各样的来源。Perl 和 Python 是我想到的另外两个工具。

在缺少可移植工具的情况下，在 make 函数中封装不可移植的工具有时也可以做到同样的效果。例如，为了支持用于 `Enterprise JavaBeans` 的各种编译器(每个编译器的调用语法略有不同)，我们可以编写一个基本函数来编译 EJB jar 并对其进行参数化，以允许插入不同的编译器。

```makefile
EJB_TMP_JAR = $(TMPDIR)/temp.jar

# $(call compile-generic-bean, bean-type, jar-name,
# bean-files-wildcard, manifest-name-opt )
define compile-generic-bean
    $(RM) $(dir $(META_INF))
    $(MKDIR) $(META_INF)

    $(if $(filter %.xml %.xmi, $3), \
        cp $(filter %.xml %.xmi, $3) $(META_INF))
    $(call compile-$1-bean-hook,$2)
    cd $(OUTPUT_DIR) &&                     \
    $(JAR) -cf0 $(EJB_TMP_JAR)              \
        $(call jar-file-arg,$(META_INF))    \
        $(call bean-classes,$3)
    $(call $1-compile-command,$2)
    $(call create-manifest,$(if $4,$4,$2),,)
endef
```

这个通用 EJB 编译函数的第一个参数是我们正在使用的 bean 编译器的类型，例如 Weblogic、Websphere 等。剩下的参数是 jar 名称、构成 jar 内容的文件(包括配置文件)和一个可选的清单文件。模板函数首先删除旧的临时目录，然后重新创建一个干净的临时区域。接下来，函数将依赖中出现的 xml 或 xmi 文件复制到 `$(META_INF)` 目录中。此时，我们可能需要执行自定义操作来清理 META-INF 文件或准备 .class 文件。为了支持这些操作，我们包含了一个钩子函数 `compile-$1-bean-hook`，如果需要，用户可以定义它。例如，如果 Websphere 编译器需要一个额外的控制文件，比如一个 xsl 文件，我们可以写这个钩子:

```makefile
# $(call compile-websphere-bean-hook, file-list)
define compile-websphere-bean-hook
    cp $(filter %.xsl, $1) $(META_INF)
endef
```

通过简单地定义这个函数，我们可以确保 `compile-generic-bean` 中的调用将被适当地展开。如果不选择编写钩子函数，则 `compile-generic-bean` 中的调用将扩展为空。

接下来，泛型函数创建 jar。帮助函数 `jar-file-ar`g 将一个普通的文件路径分解为一个 `-C` 选项和一个相对路径:

```makefile
# $(call jar-file-arg, file-name)
define jar-file-arg
    -C "$(patsubst %/,%,$(dir $1))" $(notdir $1)
endef
```

帮助函数 `bean-classes` 从源文件列表中提取相应的类文件(jar文件只需要接口和主类):

```makefile
# $(call bean-classes, bean-files-list)
define bean-classes
  $(subst $(SOURCE_DIR)/,,                  \
    $(filter %Interface.class %Home.class,  \
      $(subst .java,.class,$1)))
endef
```

然后泛型函数用 `$(call $1-compilecommand，$2)` 调用所选的编译器:

```makefile
define weblogic-compile-command
    cd $(TMPDIR) && \
    $(JVM) weblogic.ejbc -compiler $(EJB_JAVAC) $(EJB_TMP_JAR) $1
endef
```

最后，泛型函数添加了清单。

定义了 `compile-generic-bean` 之后，我们将它包装在一个特定于编译器的函数中，用于我们想要支持的每个环境。

```makefile
# $(call compile-weblogic-bean, jar-name,
#                               bean-files-wildcard, manifest-name-opt )
define compile-weblogic-bean
    $(call compile-generic-bean,weblogic,$1,$2,$3)
endef
```

### 标准 shell

值得在此重申的是，在从一个系统转移到另一个系统时发现的一个令人讨厌的不兼容性是 `/bin/sh` 的功能，这是 make 使用的默认 shell。如果您发现自己正在调整makefile 中的命令脚本，那么应该考虑标准化您的 shell。当然，对于典型的开放源码项目来说，这是不合理的，因为 makefile 是在不受控制的环境中执行的。然而，在受控的设置中，使用一组固定的特殊配置的机器，这是相当合理的。

除了避免 shell 不兼容之外，许多 shell 还提供了可以避免使用大量小实用程序的特性。例如，bash shell 包括增强的 shell 变量扩展，例如 %% 和 ##，这有助于避免使用 sed 和 expr 等 shell 工具。

## Automake

本章的重点是如何有效地使用GNU make和支持工具来实现一个可移植的构建系统。然而，有些时候，即使是这些适度的要求也是遥不可及的。如果您不能使用 GNU make 的增强特性，而不得不依赖于一组最小公分母的特性，那么您应该考虑使用 automake 工具 <http://www.gnu.org/software/automake/automake.html>。

automake 工具接受一个程式化的 makefile 作为输入，并生成一个可移植的老式 makefile 作为输出。Automake 是围绕一组 m4 宏构建的，这些宏允许在输入文件(称为 makefile.am)中使用非常简洁的符号。通常，automake 与 autoconf 一起使用，`autoconf` 是 `C/C++` 程序的可移植性支持包，但 `autoconf` 不是必需的。

虽然 automake 对于需要最大可移植性的构建系统来说是一个很好的解决方案，但是它生成的 makefile 不能使用 GNU make 的任何高级特性，除了附加赋值，`+=`，它对这个特性有特殊的支持。此外，automake 的输入与普通的 makefile 输入几乎没有相似之处。因此，使用 automake (不使用 autoconf )与使用最小公分母方法并没有太大的区别。

## 参考资料

- [Managing Projects with GNU Make](https://book.douban.com/subject/1850994/)
