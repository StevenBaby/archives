# GNU Make 项目管理 第十一章 Makefile 案例

[annotation]: <id> (2ab7517a-9d9d-4adc-9f7a-a8c5fcdbfa82)
[annotation]: <status> (public)
[annotation]: <create_time> (2021-04-17 23:47:31)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Make|Makefile|GNU)
[annotation]: <topic> (GNU Make项目管理)
[annotation]: <index> (11)
[annotation]: <comments> (true)
[annotation]: <url> (http://blog.ccyg.studio/article/2ab7517a-9d9d-4adc-9f7a-a8c5fcdbfa82)


## Linux 内核 Makefile

Linux 内核的 **Makefile** 是在复杂的构建环境中使用 **make** 的绝佳案例。 尽管解释 Linux 内核是如何组织以及构建的有点超纲，但我们依然可以研究 Linux 内核构建系统中，采用 make 的几个有意思的用法。有关 2.5/2.6 内核构建过程及其从 2.4 方法演变而来的更完整的讨论，参见 ~~<http://macarchive.linuxsymposium.org/ols2003/Proceedings/All-Reprints/Reprint-Germaschewski-OLS2003.pdf>~~ 

> 以上文件失效，参见 <https://www.kernel.org/doc/mirror/ols2003.pdf>，不过我不知道这个是不是一致的。

由于这里 makefile 有诸多方面，我们将仅讨论一些适用于多种应用程序的功能。首先，我们将研究如何使用单字母生成变量来模拟单字母命令行选项。我们将看到源码和二进制树以一种方式分开，以允许用户从源代码树中调用 **make**。接下来，我们研究 makefile 控制输出详细程度的方式。然后，我们将回顾用户自定义函数最有趣的部分和他们如何减少代码冗余，提高可读性，并提供封装。最后，我们将研究 makefile 实现一个简单的帮助工具的方式。

Linux 内核构建遵循与大多开源软件相似的配置、构建、安装的模式。尽管很多开源软件包使用单独的配置脚本（一般用 **autoconf** 来构建），Linux 内核 **makefile** 用 make 间接地执行脚本，辅助脚本和帮助程序来实现配置。

当配置阶段完成后，简单的 `make` 或 `make all` 将构建裸内核，所有的模块，并生成压缩的内核镜像（这里分别是是 vmlinux, modules，和 bzImage 目标，），每个内核版本在连接到内核的文件 version.o 中都具有唯一的版本号。此版本号（和 version.o 文件）就是由 makefile 本身更新的。

Some makefile features you might want to adapt to your own makefile are: the handling
of command line options, analyzing command-line goals, saving build status
between builds, and managing the output of make.

这里有一些 **makefile** 功能，可能是你在自己的 makefile 想要实现的：

- 命令行参数的处理
- 分析命令行目标
- 在两次构建之间保存构建状态
- 管理 make 的输出

### 命令行选项

makefile 的第一部分包括从命令行设置通用构建选项的代码。下面是控制详细(verbose)标志的摘录：

```makefile
To put more focus on warnings, be less verbose as default
# Use 'make V=1' to see the full commands
ifdef V
    ifeq ("$(origin V)", "command line")
        KBUILD_VERBOSE = $(V)
    endif
endif
ifndef KBUILD_VERBOSE
    KBUILD_VERBOSE = 0
endif
```

这里内嵌的 `ifdef/ifeq` 对确保了尽在命令行参数中有 `V` 时，才对 `KBUILD_VERBOSE` 变量进行设置。在环境或 makefile 文件中设置 `V` 是无效的。然后 `ifndef` 条件将关闭详细选项，要从环境或文件中设置详细选项，必须设置 `KBUILD_VERBOSE` 而不是 `V`。

但是请注意，直接在命令行上设置 `KBUILD_VERBOSE` 时允许的，并且可以如期执行。这在编写 shell 脚本时很有用（或使用别名）来调用 makefile。这样脚本将产生更多的日志，类死于使用 GNU 长选项。

其他命令行选项，稀疏检查 `C` 和 外部模块 `M` 都使用相同的检查，以避免意外地从 `makefile` 内部设置他们。

下一部分时 **makefile** 处理输出目录的选项 O。这是相当复杂的一段代码，为了突出其结构，我们将省略摘要中的一些部分：

```makefile
# kbuild supports saving output files in a separate directory.
# To locate output files in a separate directory two syntax'es are supported.
# In both cases the working directory must be the root of the kernel src.
# 1) O=
# Use "make O=dir/to/store/output/files/"
#
# 2) Set KBUILD_OUTPUT
# Set the environment variable KBUILD_OUTPUT to point to the directory
# where the output files shall be placed.
# export KBUILD_OUTPUT=dir/to/store/output/files/
# make
#
# The O= assigment takes precedence over the KBUILD_OUTPUT environment variable.
# KBUILD_SRC is set on invocation of make in OBJ directory
# KBUILD_SRC is not intended to be used by the regular user (for now)
ifeq ($(KBUILD_SRC),)
    # OK, Make called in directory where kernel src resides
    # Do we want to locate output files in a separate directory?
    ifdef O
        ifeq ("$(origin O)", "command line")
            KBUILD_OUTPUT := $(O)
        endif
    endif
    …
    ifneq ($(KBUILD_OUTPUT),)
        …
        .PHONY: $(MAKECMDGOALS)

        $(filter-out _all,$(MAKECMDGOALS)) _all:
            $(if $(KBUILD_VERBOSE:1=),@)$(MAKE) -C $(KBUILD_OUTPUT) \
            KBUILD_SRC=$(CURDIR) KBUILD_VERBOSE=$(KBUILD_VERBOSE) \
            KBUILD_CHECK=$(KBUILD_CHECK) KBUILD_EXTMOD="$(KBUILD_EXTMOD)" \
            -f $(CURDIR)/Makefile $@
        # Leave processing to above invocation of make
        skip-makefile := 1
    endif # ifneq ($(KBUILD_OUTPUT),)
endif # ifeq ($(KBUILD_SRC),)

# We process the rest of the Makefile if this is the final invocation of make
ifeq ($(skip-makefile),)
    …the rest of the makefile here…
endif # skip-makefile
```

本质上，这表明如果设置了 `KBUILD_OUTPUT`，则在 `KBUILD_OUTPUT` 定义的输出目录中递归调用 `make`，将 `KBUILD_SRC` 设置为最开始执行 `make` 的目录，并从那里获取 makefile。make 不会看到 makefile 的其余部分，直到 `skip-makefile` 设置，递归的 `make` 将再次读取相同的 `makefile`，仅这次将设置 `KBUILD_SRC`，所以 `skip-makefile` 将是未定义的，其余的 `makefile` 将被读取和处理。

命令行处理的结果. 使得大量的 `makefile` 在 `ifeq ($(skip-makefile),)` 中被处理。

### 配置与构建

## 参考资料

- [Managing Projects with GNU Make](https://book.douban.com/subject/1850994/)