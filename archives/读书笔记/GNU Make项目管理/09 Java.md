# GNU Make 项目管理 第九章 Java

[annotation]: [id] (0f80e21a-79ca-401a-a92c-d89967364b12)
[annotation]: [status] (public)
[annotation]: [create_time] (2021-04-18 19:21:47)
[annotation]: [category] (读书笔记)
[annotation]: [tags] (Make|Makefile|GNU)
[annotation]: [topic] (GNU Make 项目管理)
[annotation]: [index] (9)
[annotation]: [comments] (true)
[annotation]: [url] (http://blog.ccyg.studio/article/0f80e21a-79ca-401a-a92c-d89967364b12)

> 首先，我讨厌 Java，其次，这个声明和原书作者无关，然后，我们继续吧。

许多Java开发人员喜欢集成开发环境(IDE)，比如 Eclipse。有了诸如 Java IDE 和 Ant 这样知名的替代方案，读者可能会问，为什么要考虑在 Java 项目中使用 make。本章探讨了在这些情况下 make 的价值;特别是，它提供了一个通用的 makefile，它可以被放入任何 Java 项目中，只需进行最小的修改，就可以执行所有标准的重建任务。

在 Java 中使用 make 带来了几个问题，也带来了一些机会。这主要是由于三个因素: Java编译器，javac，非常快; 标准的 Java编译器支持 `@filename` 语法从文件中读取“命令行参数”;如果指定了 Java 包，Java 语言将指定 `.class` 文件的路径。

标准的 Java 编译器非常快。这主要是由于 `import` 指令的工作方式。类似于 C 中的 `#include`，这个指令用于允许访问外部定义的符号。但是，Java 直接读取类文件，而不是重新读取源代码，然后需要对源代码进行解析和分析。因为类文件中的符号在编译过程中不能更改，所以编译器将缓存类文件。即使在中等规模的项目中，这也意味着与 C 相比，Java 编译器可以避免重新阅读、解析和分析数以百万计的代码行。更适度的性能改进是由于大多数 Java 编译器只执行了最少量的优化。相反，Java 依赖于由 Java 虚拟机 (JVM) 本身执行的复杂的即时 (JIT) 优化。

大多数大型 Java 项目都广泛使用 Java 的包。一个类被声明封装在一个包中，这个包围绕文件定义的符号形成一个作用域。包名是分层的，并且隐式地定义了一个文件结构。例如，包 `a.b.c` 将隐式定义目录结构 `a/b/c`。声明在 `a.b.c` 包中的代码将被编译为 `a/b/c` 目录中的类文件。这意味着 make 将二进制文件与其源文件关联起来的普通算法失败了。但这也意味着不需要指定-o选项来指明输出文件应该放在哪里。指出输出树的根(对于所有文件都是相同的)就足够了。反过来，这意味着可以使用相同的命令行调用来编译来自不同目录的源文件。

标准的 Java 编译器都支持 `@filename` 语法，允许从文件中读取命令行参数。这与包特性相结合是非常重要的，因为这意味着可以通过一次 Java 编译器的执行来编译项目的整个 Java 源代码。这是一个主要的性能改进，因为加载和执行编译器所花费的时间是构建时间的主要因素。

总之，在 2.5 GHz Pentium 4 处理器上，通过组合正确的命令行，编译 40 万行 Java 代码大约需要 3 分钟。编译一个等价的 C++ 应用程序需要数小时。

## make 的替代品

如前所述，Java 开发人员社区热情地采用新技术。让我们看看 Ant 和 IDE 是如何与 make 关联起来的。

### Ant

Java 社区非常活跃，以惊人的速度生产新的工具和 api。其中一个新工具是 Ant，它是一个构建工具，旨在取代 Java 开发过程中的 make。与 make 一样，Ant 使用描述文件来指示项目的目标和先决条件。与 make 不同，Ant 是用 Java 编写的，Ant 构建文件是用 XML 编写的。

为了让您对 XML 构建文件有个感觉，下面是 Ant 构建文件的摘录:

```xml
<target name="build"
        depends="prepare, check_for_optional_packages"
        description="--> compiles the source code">
    <mkdir dir="${build.dir}"/>
    <mkdir dir="${build.classes}"/>
    <mkdir dir="${build.lib}"/>

    <javac  srcdir="${java.dir}"
            destdir="${build.classes}"
            debug="${debug}"
            deprecation="${deprecation}"
            target="${javac.target}"
            optimize="${optimize}" >
        <classpath refid="classpath"/>
    </javac>

    …

    <copy todir="${build.classes}">
        <fileset dir="${java.dir}">
            <include name="**/*.properties"/>
            <include name="**/*.dtd"/>
        </fileset>
    </copy>
</target>
```

如您所见，使用XML `<target>` 标记引入了一个目标。每个目标都有一个名称和依赖列表，分别用 `<name>` 和 `<depends>` 属性指定。操作由 Ant 任务执行。任务是用 Java 编写并绑定到 XML 标记的。例如，创建目录的任务是用 `<mkdir>` 标记指定的，并触发 Java 方法 `Mkdir` 的执行。执行，最终调用 `File.mkdir`。所有任务都尽可能使用 Java API 实现。

使用 make 语法的等价构建文件是:

```makefile
# compiles the source code
build: $(all_javas) prepare check_for_optional_packages
    $(MKDIR) -p $(build.dir) $(build.classes) $(build.lib)
    $(JAVAC) -sourcepath $(java.dir)                        \
        -d $(build.classes)                                 \
        $(debug)                                            \
        $(deprecation)                                      \
        -target $(javac.target)                             \
        $(optimize)                                         \
        -classpath $(classpath)                             \
        @$<

    …

    $(FIND) . \( -name '*.properties' -o -name '*.dtd' \) | \
    $(TAR) -c -f - -T - | $(TAR) -C $(build.classes) -x -f -
```

make的这段代码使用了本书尚未讨论的技术。足以说明依赖 `all.Javas` 包含要编译的所有 Java 文件的列表。Ant 任务 `<mkdir>`, `<javac>`, 和 `<copy>`  也执行依赖项检查。即如果目录已经存在，则不执行 `mkdir`。同样，如果 Java 类文件比源文件新，则不会编译源文件。不过，make 命令脚本执行的功能本质上是相同的。Ant 包含一个通用任务，名为 `<exec>`，用于运行本地程序。

Ant 是构建工具的一种聪明而新颖的方法;然而，它提出了一些值得考虑的问题:

- 尽管 Ant 在 Java 社区中得到了广泛的接受，但它在其他地方仍然相对不为人知。此外，它的受欢迎程度是否会远远超出 Java (原因在这里列出)似乎值得怀疑。另一方面，Make 一直被广泛应用于软件开发、文档处理和排版、网站和工作站维护等领域。对于任何需要处理各种软件系统的人来说，理解 make 是很重要的。

- 选择 XML 作为描述语言适合于基于 java 的工具。但是(对许多人来说)编写或阅读 XML 并不是特别愉快。好的 XML 编辑器很难找到，而且经常不能与现有工具很好地集成(集成开发环境包括一个好的 XML 编辑器，或者我必须离开 IDE 去找一个单独的工具)。正如您从前面的示例中可以看到的，与 make 和 shell 语法相比，XML 和 Ant 语法尤其冗长。XML 充满了它自己的特性。

- 在编写Ant构建文件时，您必须与另一个间接层相抗衡。Ant `<mkdir>` 任务不会调用系统的底层 `mkdir` 程序。相反，它执行 `java.io.File` 类的 `mkdir()` 方法。这可能会，也可能不会达到你的预期。从本质上讲，程序员向 Ant 提供的任何有关常用工具行为的知识都是可疑的，必须根据 Ant 文档、Java 文档或 Ant 源代码进行检查。此外，例如，为了调用 Java 编译器，我可能不得不浏览十几个或更多不熟悉的 XML 属性，例如 `<srcdir>`, `<debug>` 等，这些属性在编译器手册中没有记录。相比之下，make 脚本是完全透明的，也就是说，我通常可以直接在 shell 中输入命令来查看它们的行为。

- 当然，尽管 Ant 是可移植的，make 也是。如第七章所示，编写可移植的 makefile，就像编写可移植的 Ant 文件一样，需要经验和知识。程序员编写可移植的 makefile 已经有 20 年了。此外，Ant 文档还指出，Unix 上的符号链接和 Windows 上的长文件名存在可移植性问题，MacOS X 是唯一支持的苹果操作系统，而且无法保证对其他平台的支持。此外，不能从 Java API 执行像设置文件执行位这样的基本操作。必须使用外部程序。可移植性从来都不是简单或完整的。

- Ant 工具并没有准确地解释它在做什么。因为 Ant 任务通常不是通过执行 shell 命令来实现的，所以 Ant 工具很难显示它的操作。通常，显示由任务作者添加的 print 语句的自然语言组成。用户不能从 shell 执行这些打印语句。相比之下，make 所回显的行通常是命令行，用户可以复制并粘贴到 shell 中，以便重新执行。这意味着 Ant 构建对于试图理解构建过程和工具的开发人员来说用处不大。此外，开发人员不可能在键盘上即兴重用任务的一部分。

- 最后也是最重要的一点是，Ant 将构建范式从脚本编程语言转换为非脚本编程语言。Ant 任务是用 Java 编写的。如果一个任务不存在或不能完成你想要的任务，你必须用 Java 编写自己的任务或使用 `<exec>` 任务。(当然，如果经常使用 `<exec>` 任务，那么简单地使用 make 和它的宏、函数以及更紧凑的语法会更好。)

另一方面，脚本语言的发明和发展正是为了解决这类问题。Make 已经存在了近 30 年，可以在最复杂的情况下使用，而无需扩展其实现。当然，在这 30 年里也有过一些扩展。它们中的许多都是在 GNU make 中构思和实现的。

Ant 是一个了不起的工具，在 Java 社区中被广泛接受。但是，在开始一个新项目之前，请仔细考虑 Ant 是否适合您的开发环境。本章将向您证明 make 可以有效地满足您的 Java 构建需求。

### 集成开发环境

许多 Java 开发人员使用集成开发环境(IDE)，该环境将编辑器、编译器、调试器和代码浏览器捆绑在一个(通常)图形化环境中。示例包括开源 Eclipse (<http://www.eclipse.org>)和 Emacs JDEE (<http://jdee.sunsite.dk>)，以及来自商业供应商的 Sun Java Studio (<http://wwws.sun.com/software/sundev/jde>)和 JBuilder (<http://www.borland.com/jbuilder>)。这些环境通常具有项目构建过程的概念，该过程编译必要的文件并支持应用程序执行。

如果 IDE 支持所有这些，我们为什么要考虑使用 make 呢?最明显的原因是可移植性。如果需要在另一个平台上构建项目，那么在移植到新目标时，构建可能会失败。尽管 Java 本身可以跨平台移植，但支持工具往往不能。例如，如果项目的配置文件包含 unix 或 windows 样式的路径，那么当构建在其他操作系统上运行时，这些可能会生成错误。使用 make 的第二个原因是支持无人参与的构建。有些 IDE 支持批处理构建，有些则不支持。对此特性的支持质量也各不相同。最后，包含的构建支持通常是有限的。如果您希望实现定制的发布目录结构、集成来自外部应用程序的帮助文件、支持自动化测试以及处理开发的分支和并行，那么您可能会发现集成的构建支持不足。

根据我自己的经验，我发现 IDE 适合小规模或本地化开发，但生产构建需要 make 所能提供的更全面的支持。我通常使用 IDE 编写和调试代码，并为产品构建和发布编写 makefile。在开发期间，我使用 IDE 将项目编译为适合调试的状态。但是，如果我更改了许多文件或修改了输入到代码生成器中的文件，那么我就运行 makefile。我使用的 IDE 对外部源代码生成工具没有很好的支持。通常，IDE 构建的结果不适合发布给内部或外部客户。我用 make 来完成这个任务。

## 一个通用的 Java Makefile

例 9-1 显示了一个用于Java的通用 makefile，我将在本章后面解释它的每个部分。

例 9-1 用于 Java 的通用 makefile

```makefile
# A generic makefile for a Java project.
VERSION_NUMBER := 1.0

# Location of trees.
SOURCE_DIR := src
OUTPUT_DIR := classes

# Unix tools
AWK := awk
FIND := /bin/find
MKDIR := mkdir -p
RM := rm -rf
SHELL := /bin/bash

# Path to support tools
JAVA_HOME := /opt/j2sdk1.4.2_03
AXIS_HOME := /opt/axis-1_1
TOMCAT_HOME := /opt/jakarta-tomcat-5.0.18
XERCES_HOME := /opt/xerces-1_4_4
JUNIT_HOME := /opt/junit3.8.1

# Java tools
JAVA := $(JAVA_HOME)/bin/java
JAVAC := $(JAVA_HOME)/bin/javac

JFLAGS := -sourcepath $(SOURCE_DIR) \
        -d $(OUTPUT_DIR)            \
        -source 1.4

JVMFLAGS := -ea     \
            -esa    \
            -Xfuture

JVM := $(JAVA) $(JVMFLAGS)

JAR := $(JAVA_HOME)/bin/jar
JARFLAGS := cf

JAVADOC := $(JAVA_HOME)/bin/javadoc
JDFLAGS := -sourcepath $(SOURCE_DIR)    \
            -d $(OUTPUT_DIR)            \
            -link http://java.sun.com/products/jdk/1.4/docs/api

# Jars
COMMONS_LOGGING_JAR := $(AXIS_HOME)/lib/commons-logging.jar

LOG4J_JAR := $(AXIS_HOME)/lib/log4j-1.2.8.jar
XERCES_JAR := $(XERCES_HOME)/xerces.jar
JUNIT_JAR := $(JUNIT_HOME)/junit.jar

# Set the Java classpath
class_path :=   OUTPUT_DIR          \
                XERCES_JAR          \
                COMMONS_LOGGING_JAR \
                LOG4J_JAR           \
                JUNIT_JAR

# space - A blank space
space := $(empty) $(empty)

# $(call build-classpath, variable-list)
define build-classpath
  $(strip               \
    $(patsubst :%,%,    \
      $(subst : ,:,     \
        $(strip         \
          $(foreach j,$1,$(call get-file,$j):)))))
endef

# $(call get-file, variable-name)
define get-file
  $(strip                                           \
    $($1)                                           \
      $(if $(call file-exists-eval,$1),,            \
        $(warning The file referenced by variable   \
          '$1' ($($1)) cannot be found)))
endef

# $(call file-exists-eval, variable-name)
define file-exists-eval
  $(strip                                       \
    $(if $($1),,$(warning '$1' has no value))   \
    $(wildcard $($1)))

# $(call brief-help, makefile)
define brief-help
    $(AWK) '$$1 ~ /^[^.][-A-Za-z0-9]*:/                 \
        { print substr($$1, 1, length($$1)-1) }' $1 |   \
    sort |                                              \
    pr -T -w 80 -4
endef

# $(call file-exists, wildcard-pattern)
file-exists = $(wildcard $1)

# $(call check-file, file-list)
define check-file
    $(foreach f, $1,                        \
        $(if $(call file-exists, $($f)),,   \
            $(warning $f ($($f)) is missing)))
endef

# #(call make-temp-dir, root-opt)
define make-temp-dir
    mktemp -t $(if $1,$1,make).XXXXXXXXXX
endef

# MANIFEST_TEMPLATE - Manifest input to m4 macro processor
MANIFEST_TEMPLATE := src/manifest/manifest.mf
TMP_JAR_DIR := $(call make-temp-dir)
TMP_MANIFEST := $(TMP_JAR_DIR)/manifest.mf

# $(call add-manifest, jar, jar-name, manifest-file-opt)
define add-manifest
    $(RM) $(dir $(TMP_MANIFEST))
    $(MKDIR) $(dir $(TMP_MANIFEST))
    m4 --define=NAME="$(notdir $2)"             \
        --define=IMPL_VERSION=$(VERSION_NUMBER) \
        --define=SPEC_VERSION=$(VERSION_NUMBER) \
        $(if $3,$3,$(MANIFEST_TEMPLATE))        \
        > $(TMP_MANIFEST)
    $(JAR) -ufm $1 $(TMP_MANIFEST)
    $(RM) $(dir $(TMP_MANIFEST))
endef

# $(call make-jar,jar-variable-prefix)
define make-jar
    .PHONY: $1 $$($1_name)
    $1: $($1_name)
    $$($1_name):
        cd $(OUTPUT_DIR); \
        $(JAR) $(JARFLAGS) $$(notdir $$@) $$($1_packages)
        $$(call add-manifest, $$@, $$($1_name), $$($1_manifest))
endef

# Set the CLASSPATH
export CLASSPATH := $(call build-classpath, $(class_path))

# make-directories - Ensure output directory exists.
make-directories := $(shell $(MKDIR) $(OUTPUT_DIR))

# help - The default goal
.PHONY: help
help:
    @$(call brief-help, $(CURDIR)/Makefile)

# all - Perform all tasks for a complete build
.PHONY: all
all: compile jars javadoc

# all_javas - Temp file for holding source file list
all_javas := $(OUTPUT_DIR)/all.javas

# compile - Compile the source
.PHONY: compile
compile: $(all_javas)
    $(JAVAC) $(JFLAGS) @$<

# all_javas - Gather source file list
.INTERMEDIATE: $(all_javas)
$(all_javas):
    $(FIND) $(SOURCE_DIR) -name '*.java' > $@

# jar_list - List of all jars to create
jar_list := server_jar ui_jar

# jars - Create all jars
.PHONY: jars
    jars: $(jar_list)

# server_jar - Create the $(server_jar)
server_jar_name := $(OUTPUT_DIR)/lib/a.jar
server_jar_manifest := src/com/company/manifest/foo.mf
server_jar_packages := com/company/m com/company/n

# ui_jar - create the $(ui_jar)
ui_jar_name := $(OUTPUT_DIR)/lib/b.jar
ui_jar_manifest := src/com/company/manifest/bar.mf
ui_jar_packages := com/company/o com/company/p

# Create an explicit rule for each jar
# $(foreach j, $(jar_list), $(eval $(call make-jar,$j)))
$(eval $(call make-jar,server_jar))
$(eval $(call make-jar,ui_jar))

# javadoc - Generate the Java doc from sources
.PHONY: javadoc
javadoc: $(all_javas)
    $(JAVADOC) $(JDFLAGS) @$<

.PHONY: clean
clean:
    $(RM) $(OUTPUT_DIR)

.PHONY: classpath
classpath:
    @echo CLASSPATH='$(CLASSPATH)'

.PHONY: check-config
check-config:
    @echo Checking configuration...
    $(call check-file, $(class_path) JAVA_HOME)

.PHONY: print
print:
    $(foreach v, $(V), \
        $(warning $v = $($v)))
```

## 编译 java

用 make 编译 Java 有两种方式:传统的方式，每个源文件执行一个 javac;或者使用前面提到的使用 `@filename` 语法的快速方法。

### 快速方法:一体式编译

让我们从快速方法开始。正如你在通用 makefile 中看到的:

```makefile
# all_javas - Temp file for holding source file list
all_javas := $(OUTPUT_DIR)/all.javas

# compile - Compile the source
.PHONY: compile
compile: $(all_javas)
    $(JAVAC) $(JFLAGS) @$<

# all_javas - Gather source file list
.INTERMEDIATE: $(all_javas)
$(all_javas):
    $(FIND) $(SOURCE_DIR) -name '*.java' > $@
```

伪目标编译调用一次 javac 来编译项目的所有源代码。

`$(all_javas)` 依赖是一个文件。包含一个 Java 文件列表，每行一个文件名。不需要每个文件都在自己的一行上，但是如果需要的话，使用 `grep -v` 过滤文件会更容易。该规则创造所有。java 被标记为 `.INTERMEDIATE` ，这样 make 就会在每次运行之后删除文件，从而在每次编译之前创建一个新的文件。创建文件的命令脚本非常简单。为了获得最大的可维护性，我们使用 `find` 命令来检索源树中的所有 `java` 文件。这个命令可能有点慢，但是可以保证在源代码树发生变化时几乎不需要修改就能正确地工作。

如果 makefile 中有现成的源目录列表，那么可以使用更快的命令脚本来构建 `all.javas`。如果源目录的列表是中等长度的，使命令行长度不超过操作系统的限制，这个简单的脚本可以做到:

```makefile
$(all_javas):
    shopt -s nullglob; \
    printf "%s\n" $(addsuffix /*.java,$(PACKAGE_DIRS)) > $@
```

该脚本使用 shell 通配符来确定每个目录中的 Java 文件列表。但是，如果一个目录不包含 Java 文件，我们希望通配符生成空字符串，而不是原始的通配符模式(许多 shell 的默认行为)。为了实现这种效果，我们使用 bash 选项 `shopt -s nullglob`。大多数其他 shell 都有类似的选项。最后，我们使用 `globbing` 和 `printf` 而不是 `ls -1`，因为它们是 bash 内置的，所以无论包目录的数量如何，我们的命令脚本只执行单个程序。

或者，我们可以使用通配符来避免 shell `globing`:

```makefile
$(all_javas):
    print "%s\n" $(wildcard \
                    $(addsuffix /*.java,$(PACKAGE_DIRS))) > $@
```

如果您有非常多的源目录(或非常长的路径)，那么上面的脚本可能会超过操作系统的命令行长度限制。在这种情况下，下面的脚本可能是更好的:

```makefile
.INTERMEDIATE: $(all_javas)
$(all_javas):
    shopt -s nullglob;                  \
    for f in $(PACKAGE_DIRS);           \
        do                              \
            printf "%s\n" $$f/*.java;   \
        done > $@
```

请注意，编译目标和支持规则遵循非递归的 make 方法。不管有多少子目录，我们仍然有一个 makefile 和一次编译器的执行。如果你想编译所有的源代码，这是最快的方法。

此外，我们完全丢弃了所有依赖项信息。有了这些规则，make 既不知道也不关心哪个文件比哪个文件新。它只是在每次调用上编译所有内容。另一个好处是，我们可以从源树而不是二叉树执行 makefile。考虑到 make 管理依赖的能力，这似乎是一种愚蠢的方式来组织 makefile，但请考虑以下内容:

- 另一种方法(我们稍后将探讨)使用标准依赖项方法。这将为每个文件调用一个新的 javac 进程，增加了大量开销。但是，如果项目很小，编译所有源文件所花费的时间不会比编译几个文件长很多，因为 javac 编译器非常快，而进程创建通常很慢。任何少于 15 秒的构建基本上都是等价的，不管它做了多少工作。例如，在我的 1.8 ghz Pentium 4 和 512 MB RAM 上编译大约 500 个源文件(来自 Ant 发行版)需要 14 秒。编译一个文件需要5秒。

- 大多数开发人员将使用某种为单个文件提供快速编译的开发环境。当更改范围更广、需要完全重新构建或需要无人参与的构建时，将最有可能使用 makefile。

- 正如我们将看到的，实现和维护依赖关系所付出的努力相当于为 C/C++ 构建单独的源代码和二叉树(见第八章)。这是一个不容低估的任务。

正如我们将在后面的示例中看到的，`PACKAGE_DIRS` 变量使用的不是简单地构建 `all.javas` 文件。但是维护这些变量可能是一个劳动密集型的过程，而且可能很困难。对于较小的项目，可以在 makefile 中手动维护目录列表，但当目录数量超过 100 个时，手动编辑就变得容易出错和令人厌烦。此时，谨慎的做法是使用 find 来扫描这些目录:

```makefile
# $(call find-compilation-dirs, root-directory)
find-compilation-dirs = \
  $(patsubst %/,%,      \
    $(sort              \
      $(dir             \
        $(shell $(FIND) $1 -name '*.java'))))

PACKAGE_DIRS := $(call find-compilation-dirs, $(SOURCE_DIR))
```

find 命令返回一个文件列表，`dir` 丢弃只留下目录的文件，`sort` 从列表中删除重复的文件，`patsubst` 去掉末尾的斜杠。注意，`find-compile-dirs` 查找要编译的文件列表，只丢弃文件名，然后丢弃 `all.javas` 规则使用通配符来恢复文件名。这看起来很浪费，但是我经常发现包含源代码的包列表在构建的其他部分非常有用，例如扫描 `EJB` 配置文件。如果您的情况不需要一个包列表，那么务必使用前面提到的一种更简单的方法来构建 `all.javas`。

### 编译与依赖关系

要使用完全依赖项检查进行编译，首先需要一个工具从 Java 源文件中提取依赖项信息，类似于 `cc -M`。Jikes (<http://www.ibm.com/developerworks/opensource/jikes>) 是一个开源 Java 编译器，通过 `-makefile` 或 `+M` 选项支持该特性。Jikes对于单独的源代码和二进制编译并不理想，因为它总是将依赖项文件写入与源文件相同的目录中，但它是免费可用的，并且可以工作。好的方面是，它在编译时生成依赖文件，避免了单独的传递。

下面是一个依赖处理函数和使用它的规则:

```makefile
%.class: %.java
    $(JAVAC) $(JFLAGS) +M $<
    $(call java-process-depend,$<,$@)

# $(call java-process-depend, source-file, object-file)
define java-process-depend
    $(SED) -e 's/^.*\.class *:/$2 $(subst .class,.d,$2):/'  \
        $(subst .java,.u,$1) > $(subst .class,.tmp,$2)
    $(SED) -e 's/#.*//'                                     \
        -e 's/^[^:]*: *//'                                  \
        -e 's/ *\\$$$$//'                                   \
        -e '/^$$$$/ d'                                      \
        -e 's/$$$$/ :/' $(subst .class,.tmp,$2)             \
        >> $(subst .class,.tmp,$2)
    $(MV) $(subst .class,.tmp,$2).tmp $(subst .class,.d,$2)
endef
```

这需要从二进制树中执行 makefile，并设置 `vpath` 来查找源文件。如果您只想将 Jikes 编译器用于依赖项生成，而实际代码生成则需要使用另一种编译器，那么可以使用 `+B` 选项来防止 Jikes 生成字节码。

在一个编译 223 个 Java 文件的简单计时测试中，前面描述的快速方法需要 9.9 秒。用单独的编译行编译相同的 223 个文件需要 411.6 秒或 41.5 倍的时间。此外，在单独编译时，任何需要编译 4 个以上文件的构建都比用一个编译行编译所有源文件要慢。如果依赖项的生成和编译是由不同的程序执行的，差异将会增加。

当然，开发环境各不相同，但重要的是要仔细考虑您的目标。最小化编译的文件数量并不总是最小化构建系统所需的时间。特别是对于Java，完全依赖检查和最小化编译的文件数量对于正常的程序开发似乎是不必要的。

### 设置 CLASSPATH

使用 Java 开发软件时最重要的问题之一是正确设置 `CLASSPATH` 变量。此变量决定在解析类引用时加载哪些代码。要正确编译 Java 应用程序，makefile 必须包含正确的 CLASSPATH。随着 Java 包、api 和支持工具被添加到系统中，`CLASSPATH` 很快就会变得又长又复杂。如果很难正确设置 `CLASSPATH`，那么将其设置在一个地方是有意义的。

我发现一种有用的技术是使用 makefile 为自身和其他程序设置 `CLASSPATH`。例如，一个目标类路径可以返回 `CLASSPATH` 给调用 makefile 的 shell:

```makefile
.PHONY: classpath
classpath:
    @echo "export CLASSPATH='$(CLASSPATH)'"
```

开发人员可以用这个设置他们的 `CLASSPATH` (如果他们使用bash):

```text
$ eval $(make classpath)
```

Windows 环境中的 `CLASSPATH` 可以通过这个调用来设置:

```makefile
.PHONY: windows_classpath
windows_classpath:
    regtool set /user/Environment/CLASSPATH "$(subst /,\\,$(CLASSPATH))"
    control sysdm.cpl,@1,3 &
    @echo "Now click Environment Variables, then OK, then OK again."
```

`regtool` 程序是 Cygwin 开发系统中的一个实用程序，用于操作 Windows 注册表。但是，简单地设置注册表并不会导致 Windows 读取新值。一种方法是访问环境变量对话框，然后单击OK退出。

命令脚本的第二行使 Windows 显示系统属性对话框，其中 Advanced 选项卡处于活动状态。不幸的是，该命令不能显示环境变量对话框或激活 OK 按钮，所以最后一行提示用户完成任务。

将 CLASSPATH 导出到其他程序(如 Emacs JDEE 或 JBuilder 项目文件)并不困难。

设置 `CLASSPATH` 本身也可以通过 make 进行管理。设置 `CLASSPATH` 变量当然是合理的:

```makefile
CLASSPATH = /third_party/toplink-2.5/TopLink.jar:/third_party/…
```

为了可维护性，首选使用变量:

```makefile
CLASSPATH = $(TOPLINK_25_JAR):$(TOPLINKX_25_JAR):…
```

但我们可以做得更好。正如你在通用 makefile 中看到的，我们可以分两个阶段构建 `CLASSPATH`，首先将路径中的元素列为 make 变量，然后将这些变量转换为环境变量的字符串值:

```makefile
# Set the Java classpath
class_path := OUTPUT_DIR            \
                XERCES_JAR          \
                COMMONS_LOGGING_JAR \
                LOG4J_JAR           \
                JUNIT_JAR
…
# Set the CLASSPATH
export CLASSPATH := $(call build-classpath, $(class_path))
```

(例 9-1 中的 `CLASSPATH` 与其说是有用，不如说是说明性的。)一个编写良好的 `build-classpath` 函数可以解决几个恼人的问题:

- 将类路径分成几部分是非常容易的。例如，如果使用了不同的应用程序服务器，则可能需要更改 `CLASSPATH`。然后可以将 `CLASSPATH` 的不同版本包含在 `ifdef` 部分中，并通过设置 make 变量进行选择。

- makefile 的临时维护者不必担心内嵌的空格、换行或行延续，因为 `build-classpath` 函数会处理它们。

- 路径分隔符可以由 build-classpath 函数自动选择。因此，无论在 Unix 还是 Windows 上运行都是正确的。

- 路径元素的有效性可以通过 `build-classpath` 函数来验证。特别是，make 的一个恼人问题是，未定义的变量压缩成成空字符串而没有错误。在大多数情况下，这是非常有用的，但偶尔也会出现障碍。在本例中，它悄悄地为 `CLASSPATH` 变量生成一个伪值。我们可以通过让 `build-classpath` 函数检查空值元素并警告我们来解决这个问题。该函数还可以检查每个文件或目录是否存在。

> 我们可以尝试使用 `--warn-undefined-variables` 选项来识别这种情况，但这也标记了许多其他需要的空变量。

- 最后，有一个处理 `CLASSPATH` 的钩子对于更高级的特性很有用，比如帮助在路径名和搜索路径中容纳嵌入空间。

下面是一个 `build-classpath` 的实现，它处理了前三个问题:

```makefile
# $(call build-classpath, variable-list)
define build-classpath
$(strip             \
$(patsubst %:,%,    \
$(subst : ,:,       \
$(strip             \
$(foreach c,$1,$(call get-file,$c):)))))
endef

# $(call get-file, variable-name)
define get-file
    $(strip                                             \
        $($1)                                           \
        $(if $(call file-exists-eval,$1),,              \
            $(warning The file referenced by variable   \
                '$1' ($($1)) cannot be found)))
endef

# $(call file-exists-eval, variable-name)
define file-exists-eval
    $(strip                                         \
        $(if $($1),,$(warning '$1' has no value))   \
        $(wildcard $($1)))
endef
```

`build-classpath` 函数遍历其参数中的单词，验证每个元素并使用路径分隔符(在本例中为:)将它们连接起来。自动选择路径分隔符现在很容易了。然后，该函数删除 `get-file` 函数和 `foreach` 循环添加的空格。接下来，它删除 `foreach` 循环添加的最后一个分隔符。最后，整件事都被包装在一个条带中，这样由行延续引起的错误空间就被删除了。

`get-file` 函数返回其 `filename` 参数，然后测试变量是否引用现有文件。如果没有，则生成一个警告。不管文件是否存在，它都会返回变量的值，因为这个值可能对调用者有用。有时，`get-file` 可以与将要生成的文件一起使用，但该文件还不存在。

最后一个函数 `file-exists-eval` 接受包含文件引用的变量名。如果变量为空，则发出警告，否则，通配符函数将用于将值解析为文件(或相关的文件列表)。

当 `build-classpath` 函数与一些合适的伪值一起使用时，我们会看到以下错误:

```text
Makefile:37: The file referenced by variable 'TOPLINKX_25_JAR'
(/usr/java/toplink-2.5/TopLinkX.jar) cannot be found
...
Makefile:37: 'XERCES_142_JAR' has no value
Makefile:37: The file referenced by variable
            'XERCES_142_JAR' ( ) cannot be found
```

比起简单的方法，这是一个很大的改进。

`get-file` 函数的存在表明我们可以泛化对输入文件的搜索。

```makefile
# $(call get-jar, variable-name)
define get-jar
    $(strip                                                         \
        $(if $($1),,$(warning '$1' is empty))                       \
        $(if $(JAR_PATH),,$(warning JAR_PATH is empty))             \
        $(foreach d, $(dir $($1)) $(JAR_PATH),                      \
            $(if $(wildcard $d/$(notdir $($1))),                    \
                $(if $(get-jar-return),,                            \
                    $(eval get-jar-return := $d/$(notdir $($1)))))) \
        $(if $(get-jar-return),                                     \
            $(get-jar-return)                                       \
            $(eval get-jar-return :=),                              \
            $($1)                                                   \
            $(warning get-jar: File not found '$1' in $(JAR_PATH))))
endef
```

这里我们定义变量 `JAR_PATH` 来包含文件的搜索路径。返回找到的第一个文件。函数的参数是一个包含 jar 路径的变量名。我们希望首先在变量给出的路径中查找 jar 文件，然后在 `JAR_PATH` 中。为了实现这一点，`foreach` 循环中的目录列表由变量的目录和 `JAR_PATH` 组成。该参数的其他两种用法都包含在 `notdir` 调用中，因此 `jar` 名称可以由该列表中的一个路径组成。注意，我们不能退出 `foreach` 循环。因此，我们使用 `eval` 设置一个变量 `get-jar-return` 来记住我们找到的第一个文件。循环结束后，返回临时变量的值，如果没有找到任何东西，则发出警告。我们必须记住在终止宏之前重置返回值变量。

这实际上是在设置 `CLASSPATH` 的上下文中重新实现 `vpath` 特性。要理解这一点，请记住 `vpath` 是 `make` 隐式使用的搜索路径，用于查找相对路径无法从当前目录中找到的依赖。在这些情况下，在 `vpath` 中搜索先决文件，并将完成的路径插入 `$^`、`$?`、`$+` 自动变量。要设置 `CLASSPATH`，我们需要为每个 jar 文件搜索路径，并将完成的路径插入 `CLASSPATH` 变量中。因为 make 没有内置的支持，所以我们添加了自己的支持。当然，您可以简单地使用适当的 jar 文件名展开 jar 路径变量，并让 Java 执行搜索，但是 `CLASSPATH` 已经很快变得很长了。在一些操作系统上，环境变量空间是有限的，长类路径有被截断的危险。在 Windows XP 上，单个环境变量的字符限制为 1023 个字符。此外，即使 `CLASSPATH` 没有被截断，Java 虚拟机在加载类时也必须搜索 `CLASSPATH`，从而降低应用程序的速度。

## 管理 Jar 包

用 Java 构建和管理 jar 与 C/C++ 库存在不同的问题。原因有三。首先，jar 的成员包含一个相对路径，因此必须仔细控制传递给 jar 程序的精确文件名。第二，在Java 中有合并 jar 的趋势，这样一个 jar 就可以被释放来代表一个程序。最后，jar 还包括类之外的其他文件，比如清单、属性文件和 XML。

在 GNU make 中创建一个 jar 的基本命令是:

```makefile
JAR := jar
JARFLAGS := -cf

$(FOO_JAR): prerequisites…
    $(JAR) $(JARFLAGS) $@ $^
```

jar 程序可以接受目录而不是文件名，在这种情况下，目录树中的所有文件都包含在 jar 中。这非常方便，特别是与 `-C` 选项一起用于更改目录时:

```makefile
JAR := jar
JARFLAGS := -cf

.PHONY: $(FOO_JAR)
$(FOO_JAR):
    $(JAR) $(JARFLAGS) $@ -C $(OUTPUT_DIR) com
```

在这里， jar 本身被声明为 `.PHONY`，否则，后续的 makefile 运行将不会重新创建该文件，因为它没有先决条件。与前面章节中描述的 ar 命令一样，使用更新标志 `-u` 似乎没有什么意义，因为它花费的时间与从头重新创建 jar 相同或更长，至少对于大多数更新来说是这样的。

jar 通常包含一个清单，用来标识 jar 实现的供应商、API 和版本号。一个简单的清单可能看起来像:

```makefile
Name: JAR_NAME
Specification-Title: SPEC_NAME
Implementation-Version: IMPL_VERSION
Specification-Vendor: Generic Innovative Company, Inc.
```

这个清单包括三个占位符，`JAR_NAME`、`SPEC_NAME` 和 `IMPL_VERSION`，可以在 jar 创建时使用 sed、m4 或您喜欢的流编辑器替换它们。下面是一个处理清单的函数:

```makefile
MANIFEST_TEMPLATE := src/manifests/default.mf
TMP_JAR_DIR := $(call make-temp-dir)
TMP_MANIFEST := $(TMP_JAR_DIR)/manifest.mf

# $(call add-manifest, jar, jar-name, manifest-file-opt)
define add-manifest
    $(RM) $(dir $(TMP_MANIFEST))
    $(MKDIR) $(dir $(TMP_MANIFEST))
    m4 --define=NAME="$(notdir $2)"             \
        --define=IMPL_VERSION=$(VERSION_NUMBER) \
        --define=SPEC_VERSION=$(VERSION_NUMBER) \
        $(if $3,$3,$(MANIFEST_TEMPLATE))        \
        > $(TMP_MANIFEST)
    $(JAR) -ufm $1 $(TMP_MANIFEST)
    $(RM) $(dir $(TMP_MANIFEST))
endef
```

`add-manifest` 函数对与前面显示的清单文件类似的清单文件进行操作。该函数首先创建一个临时目录，然后展开示例清单。接下来，它更新 jar，最后删除临时目录。注意，函数的最后一个参数是可选的。如果 `manifest` 文件路径为空，该函数使用 `MANIFEST_TEMPLATE` 中的值。

泛型 makefile 将这些操作捆绑到泛型函数中，以编写创建 jar 的显式规则:

```makefile
# $(call make-jar,jar-variable-prefix)
define make-jar
    .PHONY: $1 $$($1_name)
    $1: $($1_name)
    $$($1_name):
        cd $(OUTPUT_DIR); \
        $(JAR) $(JARFLAGS) $$(notdir $$@) $$($1_packages)
        $$(call add-manifest, $$@, $$($1_name), $$($1_manifest))
endef
```

它接受一个参数，make 变量的前缀，该变量标识一组描述四个 jar 参数的变量:目标名称、jar 名称、jar 中的包和 jar 的清单文件。例如，对于一个名为 ui.jar 的 jar，我们可以这样写:

```makefile
ui_jar_name := $(OUTPUT_DIR)/lib/ui.jar
ui_jar_manifest := src/com/company/ui/manifest.mf
ui_jar_packages := src/com/company/ui \
                    src/com/company/lib

$(eval $(call make-jar,ui_jar))
```

通过使用变量名组合，我们可以缩短函数的调用序列，并允许非常灵活地实现函数。

如果我们有很多 jar 文件要创建，我们可以通过将 jar 名称放在一个变量中来进一步自动化:

```makefile
jar_list := server_jar ui_jar

.PHONY: jars $(jar_list)
jars: $(jar_list)

$(foreach j, $(jar_list),\
    $(eval $(call make-jar,$j)))
```

偶尔，我们需要将 jar 文件展开到一个临时目录中。下面是一个简单的函数:

```makefile
# $(call burst-jar, jar-file, target-directory)
define burst-jar
    $(call make-dir,$2)
    cd $2; $(JAR) -xf $1
endef
```

## 引用树和第三方 jar 包

要使用单一的共享引用树来支持开发人员的部分源代码树，只需让每晚构建为项目创建 jar，并将这些 jar 包含在 Java 编译器的 `CLASSPATH` 中。开发人员可以检出他需要的源代码树的部分并运行编译(假设源文件列表是由 `find` 之类的东西动态创建的)。当 Java 编译器需要来自丢失的源文件的符号时，它将搜索 `CLASSPATH` 并发现 jar 中的 `.class` 文件。

从引用树中选择第三方 jar 也很简单。只需将 jar 的路径放在 CLASSPATH 中。如前所述，makefile 是管理此过程的有用工具。当然，通过简单地设置 `JAR_PATH` 变量，`get-file` 函数可以自动选择 beta 或稳定的、本地或远程的 jar。

## 企业 JavaBeans

企业 JavaBeans 是一种在远程方法调用框架中封装和重用业务逻辑的强大技术。EJB 设置用于实现最终由远程客户端使用的服务器 API 的 Java 类。这些对象和服务使用基于 xml 的控制文件进行配置。编写 Java 类和 XML 控制文件后，必须将它们捆绑在一个 jar 中。然后，一个特殊的 EJB 编译器构建存根和绑定来实现 RPC 支持代码。

下面的代码可以插入到示例 9-1 中，以提供通用的 EJB 支持:

```makefile
EJB_TMP_JAR = $(EJB_TMP_DIR)/temp.jar
META_INF = $(EJB_TMP_DIR)/META-INF

# $(call compile-bean, jar-name,
# bean-files-wildcard, manifest-name-opt)
define compile-bean
    $(eval EJB_TMP_DIR := $(shell mktemp -d $(TMPDIR)/compile-bean.XXXXXXXX))
    $(MKDIR) $(META_INF)
    $(if $(filter %.xml, $2),cp $(filter %.xml, $2) $(META_INF))
    cd $(OUTPUT_DIR) &&                     \
    $(JAR) -cf0 $(EJB_TMP_JAR)              \
        $(call jar-file-arg,$(META_INF))    \
        $(filter-out %.xml, $2)
    $(JVM) weblogic.ejbc $(EJB_TMP_JAR) $1
    $(call add-manifest,$(if $3,$3,$1),,)
    $(RM) $(EJB_TMP_DIR)
endef

# $(call jar-file-arg, jar-file)
jar-file-arg = -C "$(patsubst %/,%,$(dir $1))" $(notdir $1)
```

`compile-bean` 函数接受三个参数:要创建的 jar 的名称、jar 中的文件列表和一个可选的清单文件。该函数首先使用 `mktemp` 程序创建一个干净的临时目录，并将目录名保存在变量 `EJB_TMP_DIR` 中。通过在 `eval` 中嵌入赋值，我们确保在每次编译 bean 展开时将 `EJB_TMP_DIR` 重置为一个新的临时目录。由于 `compile-bean` 在规则的命令脚本部分中使用，因此只有在执行命令脚本时，函数才会展开。接下来，它将 `bean` 文件列表中的任何 XML 文件复制到 `META-INF` 目录中。这是 `EJB` 配置文件所在的位置。然后，该函数构建一个临时 jar，用作 EJB 编译器的输入。`jar-file-arg` 函数将格式为 `dir1/dir2/dir3` 的文件名转换为 `-C dir1/dir2 dir3`，因此 jar 中文件的相对路径是正确的。这是 jar 命令指示 `META-INF` 目录的适当格式。`bean` 文件列表包含已经放在 `META-INF` 目录中的 `.xml` 文件，因此我们过滤掉这些文件。在构建临时 jar 之后，将调用 WebLogic EJB 编译器，生成输出 jar。然后将清单添加到编译后的 jar 中。最后，删除临时目录。

使用新函数很简单:

```makefile
bean_files = com/company/bean/FooInterface.class \
            com/company/bean/FooHome.class \
            src/com/company/bean/ejb-jar.xml \
            src/com/company/bean/weblogic-ejb-jar.xml

.PHONY: ejb_jar $(EJB_JAR)
ejb_jar: $(EJB_JAR)
$(EJB_JAR):
    $(call compile-bean, $@, $(bean_files), weblogic.mf)
```

`bean_files` 列表有点令人困惑。它引用的 `.class` 文件将相对于 `classes` 目录被访问，而 `.xml` 文件将相对于 makefile 目录被访问。
这很好，但是如果您的 bean jar 中有很多 bean 文件该怎么办呢?我们能自动建立文件列表吗?当然:

```makefile
src_dirs := $(SOURCE_DIR)/com/company/...
bean_files =                        \
    $(patsubst $(SOURCE_DIR)/%,%,   \
        $(addsuffix /*.class,       \
            $(sort                  \
                $(dir               \
                    $(wildcard      \
                        $(addsuffix /*Home.java,$(src_dirs)))))))

.PHONY: ejb_jar $(EJB_JAR)
ejb_jar: $(EJB_JAR)
$(EJB_JAR):
    $(call compile-bean, $@, $(bean_files), weblogic.mf)
```

这假设包含 EJB 源的所有目录都包含在 `src_dirs` 变量中(也可能存在不包含 EJB 源的目录)，并且以 `Home.java` 结尾的任何文件都标识包含 EJB 代码的包。设置 `bean_files` 变量的表达式首先向目录添加通配符后缀，然后调用通配符来收集 `Home.java` 文件列表。文件名被丢弃以离开目录，目录被排序以删除重复项。添加通配符 `/*.class` 后缀，以便 `shell` 将列表展开为实际的类文件。最后，将删除源目录前缀(在类树中无效)。使用 `Shell` 通配符展开而不是 `make` 的通配符，因为我们不能依赖 `make` 在类文件编译后执行它的展开。如果使通配符函数太早，它将找不到任何文件，目录缓存将阻止它再次查找。源树中的通配符是完全安全的，因为(我们假设)在 make 运行时不会添加任何源文件。

有少量的 bean jar 时，上面的代码可以工作。另一种开发风格将每个 EJB 放在自己的 jar 中。大型项目可能有几十个罐子。要自动处理这种情况，我们需要为每个 EJB jar 生成显式规则。在本例中，EJB 源代码是自包含的:每个 EJB 都位于一个单独的目录中，包含其相关的 XML 文件。EJB 目录可以通过以 `Session.java` 结尾的文件来标识。

基本方法是在源树中搜索 EJB，然后构建一个显式规则来创建每个 EJB，并将这些规则编写到一个文件中。然后将 EJB 规则文件包含在生成文件中。EJB 规则文件的创建是由 make 自己对包含文件的依赖处理触发的。

```makefile
# session_jars - The EJB jars with their relative source path.
session_jars =
    $(subst .java,.jar, \
        $(wildcard      \
            $(addsuffix /*Session.java, $(COMPILATION_DIRS))))

# EJBS - A list of all EJB jars we need to build.
EJBS = $(addprefix $(TMP_DIR)/,$(notdir $(session_jars)))

# ejbs - Create all EJB jar files.
.PHONY: ejbs
ejbs: $(EJBS)
$(EJBS):
    $(call compile-bean,$@,$^,)
```

我们通过调用所有编译目录上的通配符来找到 `Session.java` 文件。在本例中，jar 文件是带有 .jar 后缀的会话文件的名称。这些 jar 本身将被放置在一个临时二进制目录中。EJBS 变量包含 jar 列表及其二进制目录路径。这些 EJB jar 是我们想要更新的目标。实际的命令脚本是我们的编译 bean 函数。棘手的部分是，文件列表记录在每个 jar 文件的依赖中。让我们看看它们是如何创建的。

```makefile
-include $(OUTPUT_DIR)/ejb.d

# $(call ejb-rule, ejb-name)
ejb-rule = $(TMP_DIR)/$(notdir $1):                 \
            $(addprefix $(OUTPUT_DIR)/,             \
                $(subst .java,.class,               \
                    $(wildcard $(dir $1)*.java)))   \
            $(wildcard $(dir $1)*.xml)

# ejb.d - EJB dependencies file.
$(OUTPUT_DIR)/ejb.d: Makefile
    @echo Computing ejb dependencies...
    @for f in $(session_jars);          \
    do                                  \
        echo "\$$(call ejb-rule,$$f)";  \
    done > $@
```

每个 EJB jar 的依赖关系被记录在一个单独的文件 `ejb.d` 中，它包含在 makefile 中。第一次 make 查找这个包含文件时它不存在。因此 make 调用更新包含文件的规则。该规则为每个 EJB 编写一行代码，类似于:

```makefile
$(call ejb-rule,src/com/company/foo/FooSession.jar)
```

The function ejb-rule will expand to the target jar and its list of prerequisites, something like:

```makefile
classes/lib/FooSession.jar: classes/com/company/foo/FooHome.jar \
classes/com/company/foo/FooInterface.jar \
classes/com/company/foo/FooSession.jar \
src/com/company/foo/ejb-jar.xml \
src/com/company/foo/ejb-weblogic-jar.xml
```

通过这种方式，可以在 make 中管理大量的 jar，而不会产生手工维护一组显式规则的开销。

## 参考资料

- [Managing Projects with GNU Make](https://book.douban.com/subject/1850994/)
