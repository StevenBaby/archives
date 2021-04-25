# GNU Make 项目管理 第十一章 Makefile 案例

[annotation]: [id] (2ab7517a-9d9d-4adc-9f7a-a8c5fcdbfa82)
[annotation]: [status] (public)
[annotation]: [create_time] (2021-04-17 23:47:31)
[annotation]: [category] (读书笔记)
[annotation]: [tags] (Make|Makefile|GNU)
[annotation]: [topic] (GNU Make 项目管理)
[annotation]: [index] (11)
[annotation]: [comments] (true)
[annotation]: [url] (http://blog.ccyg.studio/article/2ab7517a-9d9d-4adc-9f7a-a8c5fcdbfa82)

在本书中显示的 makefile 是工业强度相当适应您的最高级的需求。但是仍然值得看看一些来自现实项目的 makefile，看看人们在提供可交付成果的压力下用 make 做了什么。在这里，我们将详细讨论几个示例 makefile。第一个例子是构建这本书的 makefile。第二个是用于构建 Linux 2.6.7 内核的 makefile。

## 本书的 Makefile

写一本关于编程的书本身就是构建系统的有趣练习。本书的文本由许多文件组成，每个文件都需要不同的预处理步骤。这些示例是应该运行的真实程序，它们的输出被收集、后处理，并包含在主文本中(这样就不必剪切和粘贴它们，以免引入错误)。在合成过程中，能够以不同格式查看文本是很有用的。最后，运送材料需要包装。当然，所有这些都必须是可重复的，并且相对容易维护。

这对 make 来说，听起来像是一份好工作!这是 make 的一大妙处。它可以应用于各种各样的问题。这本书是用 DocBook 格式(即XML)编写的。在使用这些工具时，将 make 用在 TEX、LATEX 或 troff 上是标准过程。

例 11-1 显示了这本书的整个 makefile。大约有 440 行。makefile 被分为以下基本任务:

- 管理示例
- 预处理XML
- 生成各种输出格式
- 验证源代码
- 基本维护

```makefile
# Build the book!
#
# The primary targets in this file are:
#
# show_pdf Generate the pdf and start a viewer
# pdf Generate the pdf
# print Print the pdf
# show_html Generate the html and start a viewer
# html Generate the html
# xml Generate the xml
# release Make a release tarball
# clean Clean up generated files
#

BOOK_DIR := /test/book
SOURCE_DIR := text
OUTPUT_DIR := out
EXAMPLES_DIR := examples

QUIET = @

SHELL = bash
AWK := awk
CP := cp
EGREP := egrep
HTML_VIEWER := cygstart
KILL := /bin/kill
M4 := m4
MV := mv
PDF_VIEWER := cygstart
RM := rm -f
MKDIR := mkdir -p
LNDIR := lndir
SED := sed
SORT := sort
TOUCH := touch
XMLTO := xmlto
XMLTO_FLAGS = -o $(OUTPUT_DIR) $(XML_VERBOSE)
process-pgm := bin/process-includes
make-depend := bin/make-depend

m4-macros := text/macros.m4

# $(call process-includes, input-file, output-file)
# Remove tabs, expand macros, and process include directives.
define process-includes
    expand $1 |                                             \
    $(M4) --prefix-builtins --include=text $(m4-macros) - | \
    $(process-pgm) > $2
endef

# $(call file-exists, file-name)
# Return non-null if a file exists.
file-exists = $(wildcard $1)

# $(call maybe-mkdir, directory-name-opt)
# Create a directory if it doesn't exist.
# If directory-name-opt is omitted use $@ for the directory-name.
maybe-mkdir = $(if $(call file-exists,      \
                $(if $1,$1,$(dir $@))),,    \
                $(MKDIR) $(if $1,$1,$(dir $@)))

# $(kill-acroread)
# Terminate the acrobat reader.
define kill-acroread
    $(QUIET) ps -W |                            \
    $(AWK) 'BEGIN { FIELDWIDTHS = "9 47 100" }  \
            /AcroRd32/ {                        \
                print "Killing " $$3;           \
                system( "$(KILL) -f " $$1 )     \
            }'
endef

# $(call source-to-output, file-name)
# Transform a source tree reference to an output tree reference.
define source-to-output
$(subst $(SOURCE_DIR),$(OUTPUT_DIR),$1)
endef

# $(call run-script-example, script-name, output-file)
# Run an example makefile.
define run-script-example
    (   cd $(dir $1);                                       \
        $(notdir $1) 2>&1 |                                 \
            if $(EGREP) --silent '\$$\(MAKE\)' [mM]akefile; \
        then                                                \
            $(SED) -e 's/^++*/$$/';                         \
        else                                                \
            $(SED) -e 's/^++*/$$/'                          \
            -e '/ing directory /d'                          \
            -e 's/\[[0-9]\]//';                             \
        fi )                                                \
    > $(TMP)/out.$$$$ & \
    $(MV) $(TMP)/out.$$$$ $2
endef

# $(call generic-program-example,example-directory)
# Create the rules to build a generic example.
define generic-program-example
    $(eval $1_dir := $(OUTPUT_DIR)/$1)
    $(eval $1_make_out := $($1_dir)/make.out)
    $(eval $1_run_out := $($1_dir)/run.out)
    $(eval $1_clean := $($1_dir)/clean)
    $(eval $1_run_make := $($1_dir)/run-make)
    $(eval $1_run_run := $($1_dir)/run-run)
    $(eval $1_sources := $(filter-out %/CVS, $(wildcard $(EXAMPLES_DIR)/$1/*)))

    $($1_run_out): $($1_make_out) $($1_run_run)
        $$(call run-script-example, $($1_run_run), $$@)

    $($1_make_out): $($1_clean) $($1_run_make)
        $$(call run-script-example, $($1_run_make), $$@)

    $($1_clean): $($1_sources) Makefile
        $(RM) -r $($1_dir)
        $(MKDIR) $($1_dir)
        $(LNDIR) -silent ../../$(EXAMPLES_DIR)/$1 $($1_dir)
        $(TOUCH) $$@

    $($1_run_make):
        printf "#! /bin/bash -x\nmake\n" > $$@
endef

# Book output formats.
BOOK_XML_OUT := $(OUTPUT_DIR)/book.xml
BOOK_HTML_OUT := $(subst xml,html,$(BOOK_XML_OUT))
BOOK_FO_OUT := $(subst xml,fo,$(BOOK_XML_OUT))
BOOK_PDF_OUT := $(subst xml,pdf,$(BOOK_XML_OUT))
ALL_XML_SRC := $(wildcard $(SOURCE_DIR)/*.xml)
ALL_XML_OUT := $(call source-to-output,$(ALL_XML_SRC))
DEPENDENCY_FILES := $(call source-to-output,$(subst .xml,.d,$(ALL_XML_SRC)))

# xml/html/pdf - Produce the desired output format for the book.
.PHONY: xml html pdf
xml: $(OUTPUT_DIR)/validate
html: $(BOOK_HTML_OUT)
pdf: $(BOOK_PDF_OUT)

# show_pdf - Generate a pdf file and display it.
.PHONY: show_pdf show_html print
show_pdf: $(BOOK_PDF_OUT)
    $(kill-acroread)
    $(PDF_VIEWER) $(BOOK_PDF_OUT)

# show_html - Generate an html file and display it.
show_html: $(BOOK_HTML_OUT)
$(HTML_VIEWER) $(BOOK_HTML_OUT)

# print - Print specified pages from the book.
print: $(BOOK_FO_OUT)
    $(kill-acroread)
    java -Dstart=15 -Dend=15 $(FOP) $< -print > /dev/null

# $(BOOK_PDF_OUT) - Generate the pdf file.
$(BOOK_PDF_OUT): $(BOOK_FO_OUT) Makefile

# $(BOOK_HTML_OUT) - Generate the html file.
$(BOOK_HTML_OUT): $(ALL_XML_OUT) $(OUTPUT_DIR)/validate Makefile

# $(BOOK_FO_OUT) - Generate the fo intermediate output file.
.INTERMEDIATE: $(BOOK_FO_OUT)
$(BOOK_FO_OUT): $(ALL_XML_OUT) $(OUTPUT_DIR)/validate Makefile

# $(BOOK_XML_OUT) - Process all the xml input files.
$(BOOK_XML_OUT): Makefile

#################################################################
# FOP Support
#
FOP := org.apache.fop.apps.Fop

# DEBUG_FOP - Define this to see fop processor output.
ifndef DEBUG_FOP
    FOP_FLAGS := -q
    FOP_OUTPUT := | $(SED)  -e '/not implemented/d' \
                            -e '/relative-align/d'  \
                            -e '/xsl-footnote-separator/d'
endif

# CLASSPATH - Compute the appropriate CLASSPATH for fop.
export CLASSPATH
CLASSPATH = $(patsubst %;,%,                                \
              $(subst ; ,;,                                 \
                $(addprefix c:/usr/xslt-process-2.2/java/,  \
                  $(addsuffix .jar;,                        \
                    xalan                                   \
                    xercesImpl                              \
                    batik                                   \
                    fop                                     \
                    jimi-1.0                                \
                    avalon-framework-cvs-20020315))))

# %.pdf - Pattern rule to produce pdf output from fo input.
%.pdf: %.fo
    $(kill-acroread)
    java -Xmx128M $(FOP) $(FOP_FLAGS) $< $@ $(FOP_OUTPUT)

# %.fo - Pattern rule to produce fo output from xml input.
PAPER_SIZE := letter
%.fo: %.xml
    XSLT_FLAGS="--stringparam paper.type $(PAPER_SIZE)" \
    $(XMLTO) $(XMLTO_FLAGS) fo $<

# %.html - Pattern rule to produce html output from xml input.
%.html: %.xml
    $(XMLTO) $(XMLTO_FLAGS) html-nochunks $<

# fop_help - Display fop processor help text.
.PHONY: fop_help
fop_help:
    -java org.apache.fop.apps.Fop -help
    -java org.apache.fop.apps.Fop -print help

#################################################################
# release - Produce a release of the book.
#
RELEASE_TAR := mpwm-$(shell date +%F).tar.gz
RELEASE_FILES := README Makefile *.pdf bin examples out text

.PHONY: release
release: $(BOOK_PDF_OUT)
    ln -sf $(BOOK_PDF_OUT) .
    tar --create                    \
        --gzip                      \
        --file=$(RELEASE_TAR)       \
        --exclude=CVS               \
        --exclude=semantic.cache    \
        --exclude=*~                \
        $(RELEASE_FILES)
    ls -l $(RELEASE_TAR)

#################################################################
# Rules for Chapter 1 examples.
#

# Here are all the example directories.
EXAMPLES :=                             \
            ch01-bogus-tab              \
            ch01-cw1                    \
            ch01-hello                  \
            ch01-cw2                    \
            ch01-cw2a                   \
            ch02-cw3                    \
            ch02-cw4                    \
            ch02-cw4a                   \
            ch02-cw5                    \
            ch02-cw5a                   \
            ch02-cw5b                   \
            ch02-cw6                    \
            ch02-make-clean             \
            ch03-assert-not-null        \
            ch03-debug-trace            \
            ch03-debug-trace-1          \
            ch03-debug-trace-2          \
            ch03-filter-failure         \
            ch03-find-program-1         \
            ch03-find-program-2         \
            ch03-findstring-1           \
            ch03-grep                   \
            ch03-include                \
            ch03-invalid-variable       \
            ch03-kill-acroread          \
            ch03-kill-program           \
            ch03-letters                \
            ch03-program-variables-1    \
            ch03-program-variables-2    \
            ch03-program-variables-3    \
            ch03-program-variables-5    \
            ch03-scoping-issue          \
            ch03-shell                  \
            ch03-trailing-space         \
            ch04-extent                 \
            ch04-for-loop-1             \
            ch04-for-loop-2             \
            ch04-for-loop-3             \
            ch06-simple                 \
            appb-defstruct              \
            appb-arithmetic

# I would really like to use this foreach loop, but a bug in 3.80
# generates a fatal error.
#$(foreach e,$(EXAMPLES),$(eval $(call generic-program-example,$e)))

# Instead I expand the foreach by hand here.
$(eval $(call generic-program-example,ch01-bogus-tab))
$(eval $(call generic-program-example,ch01-cw1))
$(eval $(call generic-program-example,ch01-hello))
$(eval $(call generic-program-example,ch01-cw2))
$(eval $(call generic-program-example,ch01-cw2a))
$(eval $(call generic-program-example,ch02-cw3))
$(eval $(call generic-program-example,ch02-cw4))
$(eval $(call generic-program-example,ch02-cw4a))
$(eval $(call generic-program-example,ch02-cw5))
$(eval $(call generic-program-example,ch02-cw5a))
$(eval $(call generic-program-example,ch02-cw5b))
$(eval $(call generic-program-example,ch02-cw6))
$(eval $(call generic-program-example,ch02-make-clean))
$(eval $(call generic-program-example,ch03-assert-not-null))
$(eval $(call generic-program-example,ch03-debug-trace))
$(eval $(call generic-program-example,ch03-debug-trace-1))
$(eval $(call generic-program-example,ch03-debug-trace-2))
$(eval $(call generic-program-example,ch03-filter-failure))
$(eval $(call generic-program-example,ch03-find-program-1))
$(eval $(call generic-program-example,ch03-find-program-2))
$(eval $(call generic-program-example,ch03-findstring-1))
$(eval $(call generic-program-example,ch03-grep))
$(eval $(call generic-program-example,ch03-include))
$(eval $(call generic-program-example,ch03-invalid-variable))
$(eval $(call generic-program-example,ch03-kill-acroread))
$(eval $(call generic-program-example,ch03-kill-program))
$(eval $(call generic-program-example,ch03-letters))
$(eval $(call generic-program-example,ch03-program-variables-1))
$(eval $(call generic-program-example,ch03-program-variables-2))
$(eval $(call generic-program-example,ch03-program-variables-3))
$(eval $(call generic-program-example,ch03-program-variables-5))
$(eval $(call generic-program-example,ch03-scoping-issue))
$(eval $(call generic-program-example,ch03-shell))
$(eval $(call generic-program-example,ch03-trailing-space))
$(eval $(call generic-program-example,ch04-extent))
$(eval $(call generic-program-example,ch04-for-loop-1))
$(eval $(call generic-program-example,ch04-for-loop-2))
$(eval $(call generic-program-example,ch04-for-loop-3))
$(eval $(call generic-program-example,ch06-simple))
$(eval $(call generic-program-example,ch10-echo-bash))
$(eval $(call generic-program-example,appb-defstruct))
$(eval $(call generic-program-example,appb-arithmetic))

#################################################################
# validate
#
# Check for 1) unexpanded m4 macros; b) tabs; c) FIXME comments; d)
# RM: responses to Andy; e) duplicate m4 macros
#

validation_checks := $(OUTPUT_DIR)/chk_macros_tabs      \
                    $(OUTPUT_DIR)/chk_fixme             \
                    $(OUTPUT_DIR)/chk_duplicate_macros  \
                    $(OUTPUT_DIR)/chk_orphaned_examples

.PHONY: validate-only
validate-only: $(OUTPUT_DIR)/validate
$(OUTPUT_DIR)/validate: $(validation_checks)
    $(TOUCH) $@

$(OUTPUT_DIR)/chk_macros_tabs: $(ALL_XML_OUT)
    # Looking for macros and tabs...
    $(QUIET)! $(EGREP)  --ignore-case           \
                        --line-number           \
                        --regexp='\b(m4_|mp_)'  \
                        --regexp='\011'         \
                        $^
    $(TOUCH) $@

$(OUTPUT_DIR)/chk_fixme: $(ALL_XML_OUT)
    # Looking for RM: and FIXME...
    $(QUIET)$(AWK)                                                  \
            '/FIXME/ { printf "%s:%s: %s\n", FILENAME, NR, $$0 }    \
            /^ *RM:/ {                                              \
                if ( $$0 !~ /RM: Done/ )                            \
                printf "%s:%s: %s\n", FILENAME, NR, $$0             \
            }' $(subst $(OUTPUT_DIR)/,$(SOURCE_DIR)/,$^)
    $(TOUCH) $@

$(OUTPUT_DIR)/chk_duplicate_macros: $(SOURCE_DIR)/macros.m4
    # Looking for duplicate macros...
    $(QUIET)! $(EGREP) --only-matching              \
        "\`[^']+'," $< |                            \
    $(SORT) |                                       \
    uniq -c |                                       \
    $(AWK) '$$1 > 1 { printf "$<:0: %s\n", $$0 }' | \
    $(EGREP) "^"
    $(TOUCH) $@

ALL_EXAMPLES := $(TMP)/all_examples

$(OUTPUT_DIR)/chk_orphaned_examples: $(ALL_EXAMPLES) $(DEPENDENCY_FILES)
    $(QUIET)$(AWK) -F/ '/(EXAMPLES|OUTPUT)_DIR/ { print $$3 }'  \
        $(filter %.d,$^) |                                      \
    $(SORT) -u |                                                \
    comm -13 - $(filter-out %.d,$^)
    $(TOUCH) $@

.INTERMEDIATE: $(ALL_EXAMPLES)
$(ALL_EXAMPLES):
    # Looking for unused examples...
    $(QUIET) ls -p $(EXAMPLES_DIR) |    \
    $(AWK) '/CVS/ { next }              \
        /\// { print substr($$0, 1, length - 1) }' > $@

#################################################################
# clean
#

clean:
    $(kill-acroread)
    $(RM) -r $(OUTPUT_DIR)
    $(RM) $(SOURCE_DIR)/*~ $(SOURCE_DIR)/*.log semantic.cache
    $(RM) book.pdf

#################################################################
# Dependency Management
#
# Don't read or remake includes if we are doing a clean.
#

ifneq "$(MAKECMDGOALS)" "clean"
    -include $(DEPENDENCY_FILES)
endif

vpath %.xml $(SOURCE_DIR)
vpath %.tif $(SOURCE_DIR)
vpath %.eps $(SOURCE_DIR)

$(OUTPUT_DIR)/%.xml: %.xml $(process-pgm) $(m4-macros)
    $(call process-includes, $<, $@)

$(OUTPUT_DIR)/%.tif: %.tif
    $(CP) $< $@

$(OUTPUT_DIR)/%.eps: %.eps
    $(CP) $< $@

$(OUTPUT_DIR)/%.d: %.xml $(make-depend)
    $(make-depend) $< > $@

#################################################################
# Create Output Directory
#
# Create the output directory if necessary.
#

DOCBOOK_IMAGES := $(OUTPUT_DIR)/release/images
DRAFT_PNG := /usr/share/docbook-xsl/images/draft.png

ifneq "$(MAKECMDGOALS)" "clean"
    _CREATE_OUTPUT_DIR :=                                               \
    $(shell                                                             \
    $(MKDIR) $(DOCBOOK_IMAGES) &                                        \
    $(CP) $(DRAFT_PNG) $(DOCBOOK_IMAGES);                               \
    if ! [[ $(foreach d,                                                \
            $(notdir                                                    \
            $(wildcard $(EXAMPLES_DIR)/ch*)),                           \
            -e $(OUTPUT_DIR)/$d &) -e . ]];                             \
    then                                                                \
        echo Linking examples... > /dev/stderr;                         \
        $(LNDIR) $(BOOK_DIR)/$(EXAMPLES_DIR) $(BOOK_DIR)/$(OUTPUT_DIR); \
    fi)
endif
```

编写 makefile 是为了在 Cygwin 下运行，并没有认真尝试将其移植到 Unix。尽管如此，我相信对于 Unix 不兼容的地方很少，如果有的话，也能通过重新定义一个变量或者可能引入一个额外的变量来解决。

全局变量部分首先定义了根目录的位置以及文本、示例和输出目录的相对位置。makefile 使用的每个重要程序都被定义为一个变量。

### 管理示例

第一个任务，即管理示例，是最复杂的。每个示例都存储在 `book/examples/chn-<title>` 自己的目录中。示例包括一个 makefile 以及任何支持文件和目录。为了处理一个示例，我们首先创建一个输出树的符号链接目录，并在那里工作，这样就不会在源树中留下运行 makefile 的东西。此外，大多数示例都需要将当前工作目录设置为 makefile 的工作目录，以便生成预期的输出。在对源代码进行符号链接之后，我们执行一个 shell 脚本 run-make，用以适当的参数调用 makefile。如果源代码树中没有shell脚本，我们可以生成一个默认版本。runmake 脚本的输出保存在 make.out 中。一些示例生成了一个必须运行的可执行文件。这是通过运行脚本run-run 并将其输出保存在文件 run.out 中来完成的。

创建符号链接树由 makefile 末尾的这代码执行:

```makefile
ifneq "$(MAKECMDGOALS)" "clean"
    _CREATE_OUTPUT_DIR :=                                                   \
        $(shell                                                             \
        …
        if ! [[ $(foreach d,                                                \
            $(notdir                                                        \
            $(wildcard $(EXAMPLES_DIR)/ch*)),                               \
            -e $(OUTPUT_DIR)/$d &&) -e . ]];                                \
        then                                                                \
            echo Linking examples... > /dev/stderr;                         \
            $(LNDIR) $(BOOK_DIR)/$(EXAMPLES_DIR) $(BOOK_DIR)/$(OUTPUT_DIR); \
        fi)
endif
```

该代码包含一个简单的变量赋值，封装在 `ifneq` 条件中。条件语句的存在是为了防止 make 在 make clean 期间创建输出目录结构。实际的变量是一个假变量，它的值从来没有被使用过。但是，当 make 读取 makefile 时，右边的 `shell` 函数会立即执行。`shell` 函数检查每个示例目录是否存在于输出树中。如果缺少符号链接，将调用 `lndir` 命令来更新符号链接树。

if 所采用的测试方法值得进一步研究。对于每个示例目录，测试本身包含一个 `-e` 测试(即，该文件是否存在?)。实际的代码是这样的：使用通配符来确定所有的示例并使用 `notdir` 删除它们的目录部分，然后为每个示例目录生成文本 `-e $(OUTPUT_ DIR)/ DIR &&`。现在，连接所有这些片段，并将它们嵌入 bash `[[...]]`测试。最后，否定结果。还包含了一个额外的测试 `-e`，允许 `foreach` 循环简单地将 && 添加到每个子句中。这足以确保在发现新目录时总是将其添加到构建中。

下一步是创建将更新两个输出文件的规则。`make.out` 和 `run.out`。这是对每个示例 `.out` 文件定义函数:

```makefile
# $(call generic-program-example,example-directory)
# Create the rules to build a generic example.
define generic-program-example
    $(eval $1_dir := $(OUTPUT_DIR)/$1)
    $(eval $1_make_out := $($1_dir)/make.out)
    $(eval $1_run_out := $($1_dir)/run.out)
    $(eval $1_clean := $($1_dir)/clean)
    $(eval $1_run_make := $($1_dir)/run-make)
    $(eval $1_run_run := $($1_dir)/run-run)
    $(eval $1_sources := $(filter-out %/CVS, $(wildcard $(EXAMPLES_DIR)/$1/*)))

    $($1_run_out): $($1_make_out) $($1_run_run)
        $$(call run-script-example, $($1_run_run), $$@)

    $($1_make_out): $($1_clean) $($1_run_make)
        $$(call run-script-example, $($1_run_make), $$@)

    $($1_clean): $($1_sources) Makefile
        $(RM) -r $($1_dir)
        $(MKDIR) $($1_dir)
        $(LNDIR) -silent ../../$(EXAMPLES_DIR)/$1 $($1_dir)
        $(TOUCH) $$@

    $($1_run_make):
        printf "#! /bin/bash -x\nmake\n" > $$@
endef
```

这个函数打算在每个示例目录中调用一次:

```makefile
$(eval $(call generic-program-example,ch01-bogus-tab))
$(eval $(call generic-program-example,ch01-cw1))
$(eval $(call generic-program-example,ch01-hello))
$(eval $(call generic-program-example,ch01-cw2))
```

函数开头的变量定义主要是为了方便和提高可读性。进一步的改进来自于在 `eval` 中执行赋值，因此它们的值可以立即被宏使用，而不需要额外的引号。

函数的核心是前两个目标: `$($1_run_out)` 和 `$($1_make_out)`。这些会分别为每个示例输出 `run.out` 和 `make.out` 以更新目标。变量名由示例目录名和指定的后缀 `_run_out` 或 `_make_out` 组成。

第一条规则是 `run.out` 取决于 `make.out` 和 `run-run` 脚本。也就是说，如果 make 已经运行，或者 run-run 控制脚本已经更新，则重新运行示例程序。使用 run-script-example 函数更新目标:

```makefile
# $(call run-script-example, script-name, output-file)
# Run an example makefile.
define run-script-example
    ( cd $(dir $1);                                     \
        $(notdir $1) 2>&1 |                             \
        if $(EGREP) --silent '\$$\(MAKE\)' [mM]akefile; \
        then                                            \
            $(SED) -e 's/^++*/$$/';                     \
        else                                            \
            $(SED)  -e 's/^++*/$$/'                     \
                    -e '/ing directory /d'              \
                    -e 's/\[[0-9]\]//';                 \
        fi )                                            \
    > $(TMP)/out.$$$$ &&                                \
    $(MV) $(TMP)/out.$$$$ $2
endef
```

这个函数需要脚本的路径和输出文件名。它切换到脚本的目录并运行脚本，将标准输出和错误输出通过管道过滤器进行清理

> 清理过程变得复杂。run-run 和 run-make 脚本通常使用 `bash -x` 来允许回显实际的 make 命令行。`-x` 选项将 `++` 放在输出中的每个命令之前，清理脚本将其转换为简单的 `$`，表示 shell 提示符。但是，命令并不是输出中出现的唯一信息。因为 make 正在运行这个示例，并最终启动另一个 make，所以简单的 make 文件包含额外的、不需要的输出，比如消息 进入目录… 和 离开目录… 以及在消息中显示 make 级别的数字。对于没有递归调用 make 的简单 makefile，我们去掉这个不适当的输出，以表示 make 的输出，就好像它是从顶级 shell 中运行的一样。

`make.out` 目标是相似的，但有一个附加的复杂性。如果将新文件添加到示例中，我们希望检测这种情况并重新构建示例。 `_CREATE_OUTPUT_DIR` 代码仅在发现新目录时重新构建符号链接，而不是在添加新文件时。为了检测这种情况，我们在每个示例目录中删除一个时间戳文件，指示最后一次执行 `lndir` 的时间。`$($1_clean)` 目标更新这个时间戳文件，并取决于示例目录中的实际源文件(而不是输出目录中的符号链接)。如果 make 的依赖关系分析发现示例目录中有一个比干净的时间戳文件更新的文件，命令脚本将删除符号链接输出目录，重新创建它，并删除一个新的干净的时间戳文件。当修改 makefile 本身时也会执行此操作。

最后，用来运行 makefile 的run-make shell 脚本通常是一个两行脚本。

```text
#! /bin/bash -x
make
```

生成这些样板脚本很快就变得单调乏味了，因此将 `$($1_run_make)` 目标添加为 `$($1_make_out)` 创建它的依赖。如果缺依赖，makefile 将在输出树中生成它。

当为每个示例目录执行泛型程序示例函数时，将为运行示例创建所有规则，并准备将输出包含在 XML 文件中。这些规则由 makefile 中包含的计算依赖项触发。例如，第一章的依赖文件是:

```makefile
out/ch01.xml: $(EXAMPLES_DIR)/ch01-hello/Makefile
out/ch01.xml: $(OUTPUT_DIR)/ch01-hello/make.out
out/ch01.xml: $(EXAMPLES_DIR)/ch01-cw1/count_words.c
out/ch01.xml: $(EXAMPLES_DIR)/ch01-cw1/lexer.l
out/ch01.xml: $(EXAMPLES_DIR)/ch01-cw1/Makefile
out/ch01.xml: $(OUTPUT_DIR)/ch01-cw1/make.out
out/ch01.xml: $(EXAMPLES_DIR)/ch01-cw2/lexer.l
out/ch01.xml: $(OUTPUT_DIR)/ch01-cw2/make.out
out/ch01.xml: $(OUTPUT_DIR)/ch01-cw2/run.out
out/ch01.xml: $(OUTPUT_DIR)/ch01-bogus-tab/make.out
```

这些依赖是由一个简单的 awk 脚本生成的，命名为 `makedepend`:
```aw
#! /bin/awk -f

function generate_dependency( prereq )
{
    filename = FILENAME
    sub( /text/, "out", filename )
    print filename ": " prereq
}

/^ *include-program/ {
    generate_dependency( "$(EXAMPLES_DIR)/" $2 )
}

/^ *mp_program\(/ {
    match( $0, /\((.*)\)/, names )
    generate_dependency( "$(EXAMPLES_DIR)/" names[1] )
}

/^ *include-output/ {
    generate_dependency( "$(OUTPUT_DIR)/" $2 )
}

/^ *mp_output\(/ {
    match( $0, /\((.*)\)/, names )
    generate_dependency( "$(OUTPUT_DIR)/" names[1] )
}

/graphic fileref/ {
    match( $0, /"(.*)"/, out_file )
    generate_dependency( out_file[1] );
}
```

该脚本搜索如下模式:

```aw
mp_program(ch01-hello/Makefile)
mp_output(ch01-hello/make.out)
```

(`mp_program` 宏使用程序列表格式，而 `mp_output` 宏使用程序输出格式。)脚本从源文件名和文件名参数生成依赖项。

最后，依赖文件的生成是由 make include 语句按照通常的方式触发的:

```makefile
# $(call source-to-output, file-name)
# Transform a source tree reference to an output tree reference.
define source-to-output
    $(subst $(SOURCE_DIR),$(OUTPUT_DIR),$1)
endef
...
ALL_XML_SRC := $(wildcard $(SOURCE_DIR)/*.xml)
DEPENDENCY_FILES := $(call source-to-output,$(subst .xml,.d,$(ALL_XML_SRC)))
...
ifneq "$(MAKECMDGOALS)" "clean"
    -include $(DEPENDENCY_FILES)
endif

vpath %.xml $(SOURCE_DIR)
...
$(OUTPUT_DIR)/%.d: %.xml $(make-depend)
    $(make-depend) $< > $@
```

这就完成了处理示例的代码。大部分的复杂性来自于希望包含 makefile 的实际源代码以及 make 和示例程序的实际输出。我怀疑这里也有一点“要么采取行动，要么闭嘴”的综合症。如果我相信 make 是如此的伟大，它应该能够处理这个复杂的任务，天哪，它确实可以。

### XML 预处理

冒着给子孙后代留下俗人印象的风险，我必须承认我不是很喜欢XML。我觉得它既笨拙又冗长。所以，当我发现手稿必须用DocBook书写时，我就开始寻找更传统的工具来帮助减轻痛苦。m4宏处理器和awk是两个非常有用的工具。

对于 DocBook 和 XML，有两个问题 m4 非常适合:避免冗长的 XML 语法和管理交叉引用中使用的 XML 标识符。例如，要在DocBook 中强调一个单词，你必须这样写:

```xml
<emphasis>not</emphasis>
```

使用 m4，我写了一个简单的宏，允许我这样写:

```m
mp_em(not)
```

啊，感觉好多了。此外，我还介绍了许多适用于这个材料的符号格式样式，比如 `mp_variable` 和 `mp_target`。这允许我选择一种简单的格式，比如文字格式，然后将其更改为生产部门喜欢的任何格式，而不必执行全局搜索和替换。我相信 XML 爱好者可能会给我一船的电子邮件告诉我怎么做更得体一些，但是记住 Unix 是关于现在完成工作的工具,正如 拉里·沃尔(Larry Wall) 喜欢说,“有一个以上的方式去做。”此外，我担心学习太多 XML 会腐蚀我的大脑。

m4 的第二个任务是处理用于交叉引用的 XML 标识符。每个章节、章节、例子和表格都有一个标识符:

```xml
<sect1 id="MPWM-CH-7-SECT-1">
```

References to a chapter must use this identifier. This is clearly an issue from a programming standpoint. The identifiers are complex constants sprinkled throughout the “code.” Furthermore, the symbols themselves have no meaning. I have no idea what section 1 of Chapter 7 might have been about. By using m4, I could avoid duplicating complex literals, and provide a more meaningful name:

```xml
<sect1 id="mp_se_makedepend">
```

对章节的引用必须使用这个标识符。从编程的角度来看，这显然是一个问题。标识符是散布在“代码”中的复杂常量。而且，这些符号本身没有任何意义。我不知道第七章第一节讲的是什么。通过使用 `m4`，我可以避免重复复杂的文字，并提供一个更有意义的名称:

下面是几个 m4 宏的例子:

> mp前缀代表管理项目(本书的标题)、宏处理器或让他好看一点。随你挑吧。

```m
m4_define(`mp_tag', `<$1>`$2'</$1>')
m4_define(`mp_lit', `mp_tag(literal, `$1')')
m4_define(`mp_cmd', `mp_tag(command,`$1')')
m4_define(`mp_target', `mp_lit($1)')
m4_define(`mp_all', `mp_target(all)')
m4_define(`mp_bash', `mp_cmd(bash)')
m4_define(`mp_ch_examples', `MPWM-CH-11')
m4_define(`mp_se_book', `MPWM-CH-11.1')
m4_define(`mp_ex_book_makefile',`MPWM-CH-11-EX-1')
```

另一个预处理任务是为前面讨论的示例文本实现包含特性。该文本需要将其制表符转换为空格(因为 O'Reilly 的 DocBook 转换器不能处理制表符，而 makefile 有很多制表符!)，必须包装在一个 `[CDATA[…][]` 来保护特殊字符，最后，还必须删除示例开头和结尾的额外换行符。我用另一个叫做 `process-includes` 的小 awk 程序完成了这一点:

```aw
#! /usr/bin/awk -f
function expand_cdata( dir )
{

    start_place = match( $1, "include-" )
    if ( start_place > 0 )
    {
        prefix = substr( $1, 1, start_place - 1 )
    }
    else
    {
        print "Bogus include '" $0 "'" > "/dev/stderr"
    }

    end_place = match( $2, "(</(programlisting|screen)>.*)$", tag )
    if ( end_place > 0 )
    {
        file = dir substr( $2, 1, end_place - 1 )
    }
    else
    {
        print "Bogus include '" $0 "'" > "/dev/stderr"
    }

    command = "expand " file

    printf "%s>&33;&91;CDATA[", prefix
    tail = 0
    previous_line = ""
    while ( (command | getline line) > 0 )
    {
        if ( tail )
            print previous_line;

        tail = 1
        previous_line = line
    }

    printf "%s&93;&93;&62;%s\n", previous_line, tag[1]
    close( command )
}

/include-program/ {
    expand_cdata( "examples/" )
    next;
}

/include-output/ {
    expand_cdata( "out/" )
    next;
}

/<(programlisting|screen)> *$/ {
    # Find the current indentation.
    offset = match( $0, "<(programlisting|screen)>" )

    # Strip newline from tag.
    printf $0

    # Read the program...
    tail = 0
    previous_line = ""
    while ( (getline line) > 0 )
    {
        if ( line ~ "</(programlisting|screen)>" )
        {
            gsub( /^ */, "", line )
            break
        }
        if ( tail )
            print previous_line

        tail = 1
        previous_line = substr( line, offset + 1 )
    }
    printf "%s%s\n", previous_line, line
    next
}

{
    print
}
```

在 makefile 中，我们将 XML 文件从源树复制到输出树，在此过程中转换制表符、宏和包含文件:

```makefile
process-pgm := bin/process-includes
m4-macros := text/macros.m4

# $(call process-includes, input-file, output-file)
# Remove tabs, expand macros, and process include directives.

define process-includes
	expand $1 | 											\
	$(M4) --prefix-builtins --include=text $(m4-macros) - | \
	$(process-pgm) > $2
endef

vpath %.xml $(SOURCE_DIR)

$(OUTPUT_DIR)/%.xml: %.xml $(process-pgm) $(m4-macros)
	$(call process-includes, $<, $@)
```

模式规则指出了如何将 XML 文件从源树转移到输出树中。它还说明了，如果宏或包含处理器发生变化，应该重新生成所有 XML 文件。

### 生成输出

到目前为止，我们所讨论的内容还没有真正格式化任何文本或创建任何可以打印或显示的内容。显然，makefile 的一个非常重要的特性是格式化一本书。有两种格式是我感兴趣的，`HTML` 和 `PDF`。

我首先弄明白了如何将其格式化为 `HTML`。有一个很棒的小程序 `xsltproc` 和它的帮助脚本 `xmlto`，我用它们来完成这项工作。使用这些工具，过程相当简单:

```makefile
# Book output formats.
BOOK_XML_OUT := $(OUTPUT_DIR)/book.xml
BOOK_HTML_OUT := $(subst xml,html,$(BOOK_XML_OUT))
ALL_XML_SRC := $(wildcard $(SOURCE_DIR)/*.xml)
ALL_XML_OUT := $(call source-to-output,$(ALL_XML_SRC))

# html - Produce the desired output format for the book.
.PHONY: html
	html: $(BOOK_HTML_OUT)

# show_html - Generate an html file and display it.
.PHONY: show_html
show_html: $(BOOK_HTML_OUT)
	$(HTML_VIEWER) $(BOOK_HTML_OUT)

# $(BOOK_HTML_OUT) - Generate the html file.
	$(BOOK_HTML_OUT): $(ALL_XML_OUT) $(OUTPUT_DIR)/validate Makefile

# %.html - Pattern rule to produce html output from xml input.
%.html: %.xml
	$(XMLTO) $(XMLTO_FLAGS) html-nochunks $<
```

模式规则完成了将 `XML` 文件转换为 `HTML` 文件的大部分工作。这本书被组织为一个单一的顶级文件 book.xml，其中包括每一章。顶层文件由 `BOOK_XML_OUT` 表示。`HTML` 对应的是 `BOOK_HTML_OUT`，这是一个目标。`BOOK_HTML_OUT` 文件的依赖是包含 `XML` 文件。为了方便起见，有两个伪目标，`html` 和 `show_html`，它们分别创建 html 文件并在本地浏览器中显示它。

虽然原则上很容易，但生成 PDF 要复杂得多。xsltproc 程序能够直接生成 PDF，但是我无法让它工作。所有这些工作都是在 Windows 上用 Cygwin 完成的，xsltproc 的 Cygwin 版本需要 POSIX 路径。我使用的 DocBook 的自定义版本和手稿本身包含 windows 特定的路径。我相信，这种差异给 xsltproc 带来了我无法消除的影响。相反，我选择使用 xsltproc 来生成 XML 格式化对象，并使用 Java 程序 FOP (<http://xml.apache.org/fop>) 来生成 PDF。

因此，生成 PDF 的代码有点长:

```makefile
# Book output formats.
BOOK_XML_OUT := $(OUTPUT_DIR)/book.xml
BOOK_FO_OUT := $(subst xml,fo,$(BOOK_XML_OUT))
BOOK_PDF_OUT := $(subst xml,pdf,$(BOOK_XML_OUT))
ALL_XML_SRC := $(wildcard $(SOURCE_DIR)/*.xml)
ALL_XML_OUT := $(call source-to-output,$(ALL_XML_SRC))

# pdf - Produce the desired output format for the book.
.PHONY: pdf
pdf: $(BOOK_PDF_OUT)

# show_pdf - Generate a pdf file and display it.
.PHONY: show_pdf
show_pdf: $(BOOK_PDF_OUT)
	$(kill-acroread)
	$(PDF_VIEWER) $(BOOK_PDF_OUT)

# $(BOOK_PDF_OUT) - Generate the pdf file.
$(BOOK_PDF_OUT): $(BOOK_FO_OUT) Makefile

# $(BOOK_FO_OUT) - Generate the fo intermediate output file.
.INTERMEDIATE: $(BOOK_FO_OUT)
$(BOOK_FO_OUT): $(ALL_XML_OUT) $(OUTPUT_DIR)/validate Makefile

# FOP Support
FOP := org.apache.fop.apps.Fop

# DEBUG_FOP - Define this to see fop processor output.
ifndef DEBUG_FOP
	FOP_FLAGS := -q
	FOP_OUTPUT := | $(SED) -e '/not implemented/d' \
							-e '/relative-align/d' \
							-e '/xsl-footnote-separator/d'
endif

# CLASSPATH - Compute the appropriate CLASSPATH for fop.
export CLASSPATH
CLASSPATH = $(patsubst %;,%, 									\
				$(subst ; ,;, 									\
					$(addprefix c:/usr/xslt-process-2.2/java/, 	\
						$(addsuffix .jar;, 						\
						xalan 									\
						xercesImpl 								\
						batik 									\
						fop 									\
						jimi-1.0 								\
						avalon-framework-cvs-20020315))))

# %.pdf - Pattern rule to produce pdf output from fo input.
%.pdf: %.fo
$(kill-acroread)
	java -Xmx128M $(FOP) $(FOP_FLAGS) $< $@ $(FOP_OUTPUT)

# %.fo - Pattern rule to produce fo output from xml input.
PAPER_SIZE := letter
%.fo: %.xml
	XSLT_FLAGS="--stringparam paper.type $(PAPER_SIZE)" \
	$(XMLTO) $(XMLTO_FLAGS) fo $<

# fop_help - Display fop processor help text.
.PHONY: fop_help
fop_help:
	-java org.apache.fop.apps.Fop -help
	-java org.apache.fop.apps.Fop -print help
```

正如您见，现在有两个模式规则反映了我使用的两阶段过程。`.xml` 到 `.fo` 规则调用 xmlto。`.fo` 到 `.pdf` 规则首先杀死任何正在运行的 Acrobat 阅读器(因为程序锁定 PDF 文件，阻止 FOP 写入文件)，然后运行 FOP。FOP 是一个非常罗嗦的程序，滚动数百行毫无意义的警告很快就过时了，所以我添加了一个简单的 sed 过滤器 `FOP_OUTPUT` 来删除令人讨厌的警告。然而，偶尔这些警告中有一些真实的数据，所以我添加了一个调试特性，`DEBUG_FOP`，以禁用我的过滤器。最后，像 `HTML` 版本一样，我添加了两个方便的目标，`pdf` 和 `show_pdf`，以开始整个过程。

### 验证源代码

由于 DocBook 对制表符、宏处理器、include 文件和编辑者的注释很敏感，所以要确保源文本正确和完整并不容易。为了提供帮助，我实现了四个验证目标，用于检查各种形式的正确性。

```makefile
validation_checks := $(OUTPUT_DIR)/chk_macros_tabs 		\
					$(OUTPUT_DIR)/chk_fixme 			\
					$(OUTPUT_DIR)/chk_duplicate_macros 	\
					$(OUTPUT_DIR)/chk_orphaned_examples

.PHONY: validate-only
validate-only: $(OUTPUT_DIR)/validate
$(OUTPUT_DIR)/validate: $(validation_checks)
	$(TOUCH) $@
```

每个目标生成一个时间戳文件，它们是顶级时间戳文件的依赖，验证。

```makefile
$(OUTPUT_DIR)/chk_macros_tabs: $(ALL_XML_OUT)
	# Looking for macros and tabs...
	$(QUIET)! $(EGREP) --ignore-case 		\
					--line-number 			\
					--regexp='\b(m4_|mp_)' 	\
					--regexp='\011' 		\
					$^
	$(TOUCH) $@
```

第一个检查将查找在预处理期间未展开的 `m4` 宏。这表明要么是拼写错误的宏，要么是从未定义过的宏。检查还扫描制表符。当然，这两种情况都不应该发生，但它们确实发生了!命令脚本中一个有趣的地方是 `$(QUIET)` 后面的感叹号。其目的是否定 `egrep` 的退出状态。也就是说，如果 `egrep` 确实找到了其中一个模式，make 应该认为该命令失败。

```makefile
$(OUTPUT_DIR)/chk_fixme: $(ALL_XML_OUT)
	# Looking for RM: and FIXME...
	$(QUIET)$(AWK) 												\
		'/FIXME/ { printf "%s:%s: %s\n", FILENAME, NR, $$0 } 	\
		/^ *RM:/ { 												\
			if ( $$0 !~ /RM: Done/ ) 							\
			printf "%s:%s: %s\n", FILENAME, NR, $$0 			\
		}' $(subst $(OUTPUT_DIR)/,$(SOURCE_DIR)/,$^)
	$(TOUCH) $@
```

这检查让我标记为未解决。显然，任何标记为 `FIXME` 的文本都应该被修复并删除标签。此外，任何 `RM:` 出现后没有立即被完成的都应该被标记。注意 `printf` 函数的格式是如何遵循编译器错误的标准格式的。这样，识别编译器错误的标准工具将正确地处理这些警告。

```makefile
$(OUTPUT_DIR)/chk_duplicate_macros: $(SOURCE_DIR)/macros.m4
	# Looking for duplicate macros...
	$(QUIET)! $(EGREP) --only-matching 				\
		"\[^]+'," $< | 								\
	$(SORT) | 										\
	uniq -c | 										\
	$(AWK) '$$1 > 1 { printf "$>:0: %s\n", $$0 }' | \
	$(EGREP) "^"
	$(TOUCH) $@
```

这将检查 m4 宏文件中的重复宏定义。m4 处理器不认为重新定义是一个错误，所以我添加了一个特殊检查。管道是这样的:获取每个宏中定义的符号，排序，计数重复，过滤计数为 1 的所有行，然后最后一次纯粹使用 egrep 作为退出状态。再次注意，退出状态的否定仅在找到某些东西时才会产生一个 make 错误。

```makefile
ALL_EXAMPLES := $(TMP)/all_examples

$(OUTPUT_DIR)/chk_orphaned_examples: $(ALL_EXAMPLES) $(DEPENDENCY_FILES)
	$(QUIET)$(AWK) -F/ '/(EXAMPLES|OUTPUT)_DIR/ { print $$3 }' 	\
		$(filter %.d,$^) | 										\
	$(SORT) -u | 												\
	comm -13 - $(filter-out %.d,$^)
	$(TOUCH) $@

.INTERMEDIATE: $(ALL_EXAMPLES)
$(ALL_EXAMPLES):
	# Looking for unused examples...
	$(QUIET) ls -p $(EXAMPLES_DIR) | 	\
	$(AWK) '/CVS/ { next } 				\
			/\// { print substr($$0, 1, length - 1) }' > $@
```

最后的检查将查找文本中没有引用的示例。这个目标使用了一个有趣的技巧。它需要两组输入文件:所有示例目录和所有 XML 依赖项文件。使用 `filter` 和 `filter-out` 将先决条件列表分成这两组。使用 `ls -p` (向每个目录追加一个斜杠)并扫描斜杠来生成示例目录的列表。管道首先从依赖列表中获取 XML 依赖项文件，输出在这些文件中找到的示例目录，并删除任何重复项。这些是文中实际引用的例子。这个列表被提供给 `comm` 的标准输入，而所有已知示例目录的列表被作为第二个文件提供。`-13` 选项表示 `comm` 应该只打印在第2列中找到的行(即，没有从依赖项文件中引用的目录)。

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

makefile 包含配置目标和构建目标。配置目标有 `menuconfig`、`defconfig` 等表单。像 clean 这样的维护目标也被视为配置目标。其他目标，如 `all`、`vmlinux` 和模块都是构建目标。调用配置目标的主要结果是两个文件: `.config` 和 `.config.cmd`。这两个文件由构建目标的 makefile 包含，但不包含配置目标(因为配置目标创建它们)。也可以在一次 make 调用中混合配置目标和构建目标，例如:

```text
$ make oldconfig all
```

在这种情况下，makefile 递归地调用自身，分别处理每个目标，因此分别处理配置目标和构建目标。

控制配置、构建和混合目标的代码从以下开始:

```makefile
# To make sure we do not include .config for any of the *config targets
# catch them early, and hand them over to scripts/kconfig/Makefile
# It is allowed to specify more targets when calling make, including
# mixing *config targets and build targets.
# For example 'make oldconfig all'.
# Detect when mixed targets is specified, and make a second invocation
# of make so .config is not included in this case either (for *config).

no-dot-config-targets := clean mrproper distclean \
                            cscope TAGS tags help %docs check%
config-targets := 0
mixed-targets := 0
dot-config := 1
```

变量 `no-dot-config-targets` 列出了不需要 `.config` 文件的其他目标。然后，代码初始化 `config-targets`、`mixed-targets` 和 `dotconfig` 变量。如果命令行上有任何配置目标，则 `config-targets` 变量为1。如果命令行上有构建目标，则 `dot-config` 变量为 1。最后，如果同时存在配置目标和构建目标，那么 `mixed-targets` 为 1。

设置 `do-config` 的代码是:

```makefile
ifneq ($(filter $(no-dot-config-targets), $(MAKECMDGOALS)),)
	ifeq ($(filter-out $(no-dot-config-targets), $(MAKECMDGOALS)),)
		dot-config := 0
	endif
endif
```

如果 `MAKECMDGOALS` 中有配置目标，筛选器表达式是非空的。如果过滤器表达式不为空，则 `ifneq` 部分为 `true`。这段代码很难理解，部分原因是它包含了一个双重否定。如果 `MAKECMDGOALS` 只包含配置目标，则 `ifeq` 表达式为 `true`。因此，如果 `MAKECMDGOALS` 中有配置目标并且只有配置目标，那么 `dot-config` 将被设置为 0。更详细的实现可能会使这两个条件的含义更清楚:

```makefile
config-target-list := clean mrproper distclean \
					cscope TAGS tags help %docs check%

config-target-goal := $(filter $(config-target-list), $(MAKECMDGOALS))
build-target-goal := $(filter-out $(config-target-list), $(MAKECMDGOALS))

ifdef config-target-goal
	ifndef build-target-goal
		dot-config := 0
	endif
endif
```

可以使用 `ifdef` 形式代替 `ifneq`，因为空变量被视为未定义的，但必须注意确保变量不只是包含一个空格字符串(这会导致定义它)。

`config-targets` 和 `mixed-targets` 变量在下一个代码块中设置:

```makefile
ifeq ($(KBUILD_EXTMOD),)
	ifneq ($(filter config %config,$(MAKECMDGOALS)),)
		config-targets := 1
		ifneq ($(filter-out config %config,$(MAKECMDGOALS)),)
			mixed-targets := 1
		endif
	endif
endif
```

在构建外部模块时，`KBUILD_EXTMOD` 将非空，但在正常构建期间不是。当 `MAKECMDGOALS` 包含一个带有 `config` 后缀的目标时，第一个 `ifneq` 将为 `true`。当 `MAKECMDGOALS` 也包含非配置目标时，第二个 `ifneq` 将为 `true`。

一旦设置了这些变量，它们就会被用在带有四个分支的 `if-else` 链中。代码被压缩并缩进以突出显示其结构:

```makefile
ifeq ($(mixed-targets),1)
    # We're called with mixed targets (*config and build targets).
    # Handle them one by one.
    %:: FORCE
        $(Q)$(MAKE) -C $(srctree) KBUILD_SRC= $@
else
    ifeq ($(config-targets),1)
        # *config targets only - make sure prerequisites are updated, and descend
        # in scripts/kconfig to make the *config target
        %config: scripts_basic FORCE
            $(Q)$(MAKE) $(build)=scripts/kconfig $@
    else
        # Build targets only - this includes vmlinux, arch specific targets, clean
        # targets and others. In general all targets except *config targets.
        …
        ifeq ($(dot-config),1)
            # In this section, we need .config
            # Read in dependencies to all Kconfig* files, make sure to run
            # oldconfig if changes are detected.
            -include .config.cmd
            include .config

            # If .config needs to be updated, it will be done via the dependency
            # that autoconf has on .config.
            # To avoid any implicit rule to kick in, define an empty command
            .config: ;

            # If .config is newer than include/linux/autoconf.h, someone tinkered
            # with it and forgot to run make oldconfig
            include/linux/autoconf.h: .config
                $(Q)$(MAKE) -f $(srctree)/Makefile silentoldconfig
        else
            # Dummy target needed, because used as prerequisite
            include/linux/autoconf.h: ;
        endif
        include $(srctree)/arch/$(ARCH)/Makefile
        … lots more make code …
    endif #ifeq ($(config-targets),1)
endif #ifeq ($(mixed-targets),1)
```

第一个分支 `ifeq ($(mixed-targets),1)`，处理混合命令行参数。此分支中的唯一目标是一个完全通用的模式规则。由于没有特定的规则来处理目标(这些规则在另一个条件分支中)，每个目标调用模式规则一次。这就是如何将具有配置目标和构建目标的命令行分离为一个更简单的命令行。通用模式规则调用的命令脚本递归地调用每个目标，导致应用相同的逻辑，只是这次没有混合命令行目标。使用 `FORCE` 先决条件而不是 `.PHONY`，因为模式规则如下:

```makefile
%:: FORCE
```

不能声明为 `.PHONY`。所以在任何地方都统一使用 `FORCE` 似乎是合理的。

`if-else` 链的第二个分支 `ifeq ($(config-targets),1)` 在命令行上只有配置目标时被调用。这里分支中的主要目标是模式规则 `%config` (其他目标被省略了)。命令脚本在 `scripts/kconfig` 子目录中递归调用 `make`，并沿着目标传递。奇怪的 `$(build)` 结构定义在 makefile 的末尾:

```makefile
# Shorthand for $(Q)$(MAKE) -f scripts/Makefile.build obj=dir
# Usage:
# $(Q)$(MAKE) $(build)=dir
build := -f $(if $(KBUILD_SRC),$(srctree)/)scripts/Makefile.build obj
```

如果设置了 `KBUILD_SRC`， `-f` 选项将给出脚本 `makefile` 的完整路径，否则使用简单的相对路径。接下来，`obj` 变量被设置到等号的右侧。

第三个分支，`ifeq ($(dot-config),1)`，处理需要包含两个生成的配置文件，`.config` 和 `.config.cmd` 的构建目标。最后一个分支仅包含 `autoconf.h` 的虚拟目标，以便将其用作依赖，即使它不存在。

makefile 的大部分剩余部分遵循第三和第四个分支。它包含构建内核和模块的代码。

### 管理命令行输出

内核 makefile 使用一种新技术来管理命令响应的详细级别。每一个重要的任务都有一个详细版本和一个简要版本。详细版本只是以其自然形式执行的命令，并存储在一个名为 `cmd_action` 的变量中。简要版本是一条描述操作的短消息，存储在一个名为 `quiet_cmd_action` 的变量中。例如，生成 `emacs` 标记的命令为:

```makefile
quiet_cmd_TAGS = MAKE $@
    cmd_TAGS = $(all-sources) | etags -
```

命令通过调用 cmd 函数来执行:

```makefile
# If quiet is set, only print short version of command
cmd = @$(if $($(quiet)cmd_$(1)),\
    echo ' $($(quiet)cmd_$(1))' &&) $(cmd_$(1))
```

要调用构建 emacs 标记的代码，makefile 将包含:

```makefile
TAGS:
    $(call cmd,TAGS)
```

注意 cmd 函数以 `@` 开头，因此该函数返回的唯一文本是来自 echo 命令的文本。在正常模式下，变量 `quiet` 为空，if 中的测试 `$($(quiet)cmd_$(1))` 展开为 `$(cmd_TAGS)`。因为这个变量不是空的，所以整个函数展开为:

```makefile
echo ' $(all-sources) | etags -' && $(all-sources) | etags -
```

如果需要 `quiet` 版本，变量 `quiet` 包含值 `quiet_`，函数展开为:

```makefile
echo ' MAKE $@' && $(all-sources) | etags -
```

该变量也可以设置为 silent_。因为没有 `silent_cmd_TAGS` 命令，这个值导致 `cmd` 函数不回显任何内容。

回显命令有时会变得更加复杂，特别是当命令包含单引号时。在这些情况下，makefile 包含以下代码:

```makefile
$(if $($(quiet)cmd_$(1)),echo ' $(subst ','\'',$($(quiet)cmd_$(1)))';)
```

这里的 echo 命令包含一个替换，它用转义的单引号替换单引号，以允许正确地回显单引号。不需要编写 `cmd_` 和 `quiet_cmd_` 变量的次要命令会以 `$(Q)` 作为前缀，它要么不包含任何内容，要么包含 `@`:

```makefile
ifeq ($(KBUILD_VERBOSE),1)
    quiet =
    Q =
else
    quiet=quiet_
    Q = @
endif

# If the user is running make -s (silent mode), suppress echoing of
# commands

ifneq ($(findstring s,$(MAKEFLAGS)),)
    quiet=silent_
endif
```

### 自定义函数

内核 makefile 定义了许多函数。这里我们将介绍最有趣的一些。代码被重新格式化以提高可读性。

`check_gcc` 函数用于选择 `gcc` 命令行选项。

```makefile
# $(call check_gcc,preferred-option,alternate-option)
check_gcc =                                         \
    $(shell if $(CC) $(CFLAGS) $(1) -S -o /dev/null \
        -xc /dev/null > /dev/null 2>&1;             \
    then                                            \
        echo "$(1)";                                \
    else                                            \
        echo "$(2)";                                \
    fi ;)
```

该函数的工作方式是在一个空输入文件上调用 gcc，并使用首选的命令行选项。输出文件、标准输出文件和标准错误文件将被丢弃。如果gcc 命令成功，这意味着首选的命令行选项对于这个体系结构是有效的，并且由函数返回。否则，该选项无效，并返回替代选项。一个例子可以在 `arch/i386/Makefile` 中找到:

```makefile
# prevent gcc from keeping the stack 16 byte aligned
CFLAGS += $(call check_gcc,-mpreferred-stack-boundary=2,)
```

`if_changed_dep` 函数使用一种牛逼的技术生成依赖信息。

```makefile
# execute the command and also postprocess generated
# .d dependencies file
if_changed_dep =                                            \
    $(if                                                    \
        $(strip $?                                          \
            $(filter-out FORCE $(wildcard $^),$^)           \
            $(filter-out $(cmd_$(1)),$(cmd_$@))             \
            $(filter-out $(cmd_$@),$(cmd_$(1)))),           \
        @set -e;                                            \
        $(if $($(quiet)cmd_$(1)),                           \
            echo ' $(subst ','\'',$($(quiet)cmd_$(1)))';)   \
        $(cmd_$(1));                                        \
        scripts/basic/fixdep                                \
            $(depfile)                                      \
            $@                                              \
            '$(subst $$,$$$$,$(subst ','\'',$(cmd_$(1))))'  \
            > $(@D)/.$(@F).tmp;                             \
        rm -f $(depfile);                                   \
        mv -f $(@D)/.$(@F).tmp $(@D)/.$(@F).cmd)
```

该函数由一个 `if` 子句组成。测试的细节非常模糊，但是很明显，如果需要重新生成依赖项文件，那么测试的目的是非空的。一般的依赖关系信息与文件上的修改时间戳有关。内核构建系统为这项任务增加了另一个难点。内核构建使用各种各样的编译器选项来控制组件的构造和行为。为了确保在构建期间正确地解释命令行选项，实现了 makefile，以便如果用于特定目标的命令行选项发生更改，则会重新编译该文件。让我们看看这是如何实现的。

实际上，用于编译内核中每个文件的命令保存在 `.cmd` 文件中。当执行后续构建时，make 将读取 `.cmd` 文件，并将当前的 `compile` 命令与最后的命令进行比较。如果它们不相同，则会重新生成 `.cmd` 依赖文件，从而重新生成目标文件。`.cmd` 文件通常包含两项: 表示目标文件实际文件的依赖项 和 记录命令行选项的单个变量。例如，`arch/i386/kernel/cpu/mtrr/if.c` 文件会生成这个(缩写)文件:

```makefile
cmd_arch/i386/kernel/cpu/mtrr/if.o := gcc -Wp,-MD …; if.c
deps_arch/i386/kernel/cpu/mtrr/if.o := \
    arch/i386/kernel/cpu/mtrr/if.c \
…
arch/i386/kernel/cpu/mtrr/if.o: $(deps_arch/i386/kernel/cpu/mtrr/if.o)
    $(deps_arch/i386/kernel/cpu/mtrr/if.o):
```

回到 `if_changed_dep` 函数，`strip` 的第一个参数只是比目标更新的依赖(如果有的话)。`strip` 的第二个参数是除文件和空目标 `FORCE` 之外的所有依赖。真正令人费解的是最后两个 `filter-out` 调用:

```makefile
$(filter-out $(cmd_$(1)),$(cmd_$@))
$(filter-out $(cmd_$@),$(cmd_$(1)))
```

如果命令行选项发生了变化，其中一个或两个调用将展开为非空字符串。宏 `$(cmd_$(1))` 是当前命令，`$(cmd_$ @)` 将是前一个命令，例如变量 `cmd_arch/i386/kernel/cpu/mtrr/if.o` 显示。如果新命令包含其他选项，则第一个过滤器将为空，第二个过滤器将扩展为新选项。如果新命令包含的选项较少，则第一个命令将包含已删除的选项，第二个命令将为空。有趣的是，由于筛选器接受单词列表(每个单词都作为一个独立的模式处理)，选项的顺序可以更改，筛选器仍然可以准确地识别添加或删除的选项。很漂亮的。命令脚本中的第一个语句设置了一个 `shell` 选项，在发生错误时立即退出。这可以防止多行脚本在出现问题时破坏文件。对于简单的脚本，实现这种效果的另一种方法是使用 `&&` 而不是分号连接语句。

下一条语句是一个使用本章前面“管理命令回显”小节中描述的技术编写的 `echo` 命令，然后是依赖生成命令本身。该命令写入 `$(depfile)`，然后由 `scripts/basic/fixdep` 转换。`fixdep` 命令行中嵌套的 `subst` 函数首先转义单引号，然后转义`$$` ( `shell` 语法中的当前进程号)。

最后，如果没有发生错误，则删除中间文件 `$(depfile)`，并将生成的依赖项文件(带有 `.cmd` 后缀)移动到适当的位置。

下一个函数 `if_changed_rule` 使用与 `if_changed_dep` 相同的比较技术来控制命令的执行:

```makefile
# Usage: $(call if_changed_rule,foo)
# will check if $(cmd_foo) changed, or any of the prequisites changed,
# and if so will execute $(rule_foo)

if_changed_rule =                                   \
    $(if $(strip $?                                 \
        $(filter-out $(cmd_$(1)),$(cmd_$(@F)))      \
        $(filter-out $(cmd_$(@F)),$(cmd_$(1)))),    \
    @$(rule_$(1)))
```

在最上面的 makefile 中，这个函数用于用这些宏链接内核:

```makefile
# This is a bit tricky: If we need to relink vmlinux, we want
# the version number incremented, which means recompile init/version.o
# and relink init/init.o. However, we cannot do this during the
# normal descending-into-subdirs phase, since at that time
# we cannot yet know if we will need to relink vmlinux.
# So we descend into init/ inside the rule for vmlinux again.
…

quiet_cmd_vmlinux__ = LD $@
define cmd_vmlinux__
    $(LD) $(LDFLAGS) $(LDFLAGS_vmlinux) \
    …
endef

# set -e makes the rule exit immediately on error

define rule_vmlinux__
    +set -e;                                            \
    $(if $(filter .tmp_kallsyms%,$^),,                  \
        echo ' GEN .version';                           \
        . $(srctree)/scripts/mkversion > .tmp_version;  \
        mv -f .tmp_version .version;                    \
        $(MAKE) $(build)=init;)                         \
    $(if $($(quiet)cmd_vmlinux__),                      \
        echo ' $($(quiet)cmd_vmlinux__)' &&)            \
    $(cmd_vmlinux__);                                   \
    echo 'cmd_$@ := $(cmd_vmlinux__)' > $(@D)/.$(@F).cmd
endef

define rule_vmlinux
    $(rule_vmlinux__);          \
    $(NM) $@ |                  \
    grep -v '\(compiled\)\|…' | \
    sort > System.map
endef
```

`if_changed_rule` 函数用于调用 `rule_vmlinux`，该函数执行链接并构建最终的 `System.map`。正如 `makefile` 中的注释所指出的，`rule_vmlinux__` 函数必须重新生成内核版本文件并重新链接 `init`。在重新连接 `vmlinux` 之前。这是由 `rule_vmlinux__` 中的第一个 `if` 控制的。第二个 `if` 控制链接命令 `$(cmd_vmlinux__)` 的回显。在链接命令之后，实际执行的命令将记录在 `.cmd` 文件中，以便在下一个构建中进行比较。

## 参考资料

- [Managing Projects with GNU Make](https://book.douban.com/subject/1850994/)
