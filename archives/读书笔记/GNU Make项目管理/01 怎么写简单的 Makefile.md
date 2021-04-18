# GNU Make项目管理 第一章 怎样写简单的 Makefile

[annotation]: <id> (5bddf3e8-f84d-4111-b8dc-9ff18943f299)
[annotation]: <status> (public)
[annotation]: <create_time> (2021-04-17 23:47:31)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Make|Makefile|GNU)
[annotation]: <topic> (GNU Make项目管理)
[annotation]: <index> (1)
[annotation]: <comments> (true)
[annotation]: <url> (http://blog.ccyg.studio/article/5bddf3e8-f84d-4111-b8dc-9ff18943f299)


编程技巧通常遵循及其简单的流程，编辑源文件、编译源文件到可执行的形式，然后调试编译结果。尽管将源程序转换到可执行程序是常规操作，但是如果操作不当，程序员可能会浪费大量的时间来跟踪问题。大多开发者都经历过修改功能和运行新代码的挫败感，仅仅是发现刚才的改动无法解决某个bug。然后他们发现由于某些流程错误，例如重编译源码失败，链接失败，或重构建 jar 包失败，程序并没有执行他们修改的功能，此外，随着程序复杂度的增加这些简单的任务可能会随着开发不同版本的程序而变得越来越容易出错。也可能其他平台或者其他版本的库等。

**make** 程序旨在将源码编译成为可执行文件的日常工作自动化，与脚本相比 **make** 的优势在于，你可以给 **make** 指定程序对象之间的关系，而且通过这些关系和时间戳，可以准确地知道每次生成程序的时候哪些步骤需要重新做。使用此信息，**make** 还优化了构建程序的过程而避免了一些不必要的步骤。

GNU make （和其他一些变体）正是这样做的，**make** 定义了一种语言来描述代码、中间文件和可执行文件之间的关系。它还提供了一些功能：管理备用配置，实现规范的可复用的库，以及使用用户定义的宏来对过程参数化，简而言之，可以通过提供程序组件之间的路线图以及他们如何组织在一起的方式，将 **make** 视为开发流程的中心。

**make** 的规范文件通常保存在名为 **makefile** 的文件中，下面是一个 **makefile** 文件，用以构建 **hello, world** 程序：

```makefile
hello: hello.c
    gcc hello.c -o hello
```

要编译程序的话只需在你喜欢的 shell 中执行命令：

    make

这将导致 make 程序读取 makefile 文件来构建we文件中找到的第一个目标文件。

```sh
$ make
gcc hello.c -o hello
```

如果命令行参数中包含目标，那么将会更新该目标，如果命令行参数中没有给出目标，则使用文件中第一个目标，称为默认目标。

通常，默认目标在大多书的 makefile 中应该是构建一个程序，一般会引发很多步骤。通常程序得源码是不完整的，源码必须由一些工具来生成，比如 **flex** 或者 **bison**。然后源码将被编译成二进制目标文件 (C/C++ 生成 .o 文件，Java 生成 .class 文件)。再然后，对于 C/C++，将目标文件合在一起链接成为一个可执行文件（通常由编译器 gcc 调用）

改动任何一个源代码文件，然后重新执行 make 将会导致一些（通常不会是全部）命令重复出现，所以源码得改动会适当的编译到可执行文件中。makefile 规范文件描述了代码、中间文件和可执行文件之间的关系，以便 make 可以执行最小的必要工作来更新可执行文件。

所以 **make** 的核心价值在于其执行构建程序时的一系列复杂的必要命令的能力，而且尽可能地优化这些操作来减少 编辑-编译-调试 的开发周期中所需的时间。此外，**make** 足够灵活，可以在一个文件依赖于另一个文件的任何地方使用，比如，传统编程 C/C++ , Java, TEX, 数据库管理，等等。

## 目标和依赖（先决条件）

本质上，一个 makefile 文件包含构建程序的一些列规则。其中第一个规则在 make 中是默认规则。一个规则包含三个部分：目标、先决条件和需要执行的命令：

```makefile
target: prereq1 prereq2
    commands
```

目标是必须要生成一个文件或东西，先决条件或者依赖是在目标成功创建前就必须存在的文件。命令是用于通过依赖来创建目标命令行。

下面是一个用于编译C文件 `foo.c` 到 `foo.o` 的规则：

```makefile
foo.o:  foo.c foo.h
    gcc -c foo.c
```

目标文件 `foo.o` 在冒号前面，先决条件 `foo.c` 和 `foo.h` 在冒号后面，命令行脚本在下一行，前面有一个 `TAB` 字符。

当 **make** 要评估一个规则时，他开始查找依赖和目标指示的文件。如果任何一个先决条件与某个规则关联，**make** 将尝试先更新依赖。然后，才会考虑目标文件。如果任何依赖比已有目标文件更加新，make 将通过重新执行命令来生成目标文件。每个命令行传递到 shell 然后在 自己的子 shell 中执行。如果任何命令产生错误，那么构建目标将终止，**make** 程序退出。如果一个文件最近被修改过，则它被认为比另一个文件新。

下面是一个计算输入中单词 fee, fie, foe 和 fum 出现次数的程序，它使用简单的主函数驱动 flex 扫描器。

```c
#include <stdio.h>

extern int fee_count, fie_count, foe_count, fum_count;
extern int yylex(void);

int main(int argc, char **argv)
{
    yylex();
    printf("%d %d %d %d\n", fee_count, fie_count, foe_count, fum_count);
    exit(0);
}
```

扫描器非常简单：

```flex
    int fee_count = 0;
    int fie_count = 0;
    int foe_count = 0;
    int fum_count = 0;
%%
fee fee_count++;
fie fie_count++;
foe foe_count++;
fum fum_count++;
```

这个程序的 `makefile` 同样很简单：

```makefile
count_words: count_words.o lexer.o -lfl
	gcc count_words.o lexer.o -lfl -ocount_words

count_words.o: count_words.c
	gcc -c count_words.c

lexer.o: lexer.c
	gcc -c lexer.c

lexer.c: lexer.l
	flex -t lexer.l > lexer.c
```

当第一次执行这个 **makefile** 是，我们将看到：

```text
gcc -c count_words.c 
flex -t lexer.l > lexer.c
gcc -c lexer.c
gcc count_words.o lexer.o -lfl -ocount_words
```

> 实际上由 gcc 版本不同，可能会报一些警告！！！

现在我们有了可执行程序，当然，真实的程序通常包含的模块比这个程序多得多。同样，你将会看到，这个 makefile 并没有使用大多数 make 的功能，所以它比必要的更加冗长。尽管如此，这是一个功能强大且有用的 makefile，例如，在编写本示例的过程中，我在对该程序进行试验的同时执行了这个 makefile 文件好多次。

当你查看 makefile 和示例执行时，你可能注意到 make 执行命令的顺序几乎与他们在 makefile 中的出现的顺序相反。自顶向下的模式在 makefile 中很普遍。通常缪包的一般形式首先在 makefile 中被指定，详细的信息留在了后面。make 程序有多种方法来支持这种模式。其中最主要的时 make 的两阶段执行模型和递归变量。我们将在接下来的几章中讨论这些内容。

## 依赖检查

## 最小化重新构建

## 调用 make

## 基础 Makefile 语法

## 参考资料

- [Managing Projects with GNU Make](https://book.douban.com/subject/1850994/)ke