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

The mechanics of programming usually follow a fairly simple routine of editing source files, compiling the source into an executable form, and debugging the result. 
Although transforming the source into an executable is considered routine, if done incorrectly a programmer can waste immense amounts of time tracking down the problem. Most developers have experienced the frustration of modifying a function and running the new code only to find that their change did not fix the bug. Later they discover that they were never executing their modified function because of some procedural error such as failing to recompile the source, relink the executable, or rebuild a jar. Moreover, as the program’s complexity grows these mundane tasks can become increasingly error-prone as different versions of the program are developed, perhaps for other platforms or other versions of support libraries, etc.

编程技巧通常遵循及其简单的流程，编辑源文件、编译源文件到可执行的形式，然后调试编译结果。尽管将源程序转换到可执行程序是常规操作，但是如果操作不当，程序员可能会浪费大量的时间来跟踪问题。大多开发者都经历过修改功能和运行新代码的挫败感，仅仅是发现刚才的改动无法解决某个bug。然后他们发现由于某些流程错误，例如重编译源码失败，链接失败，或重构建 jar 包失败，程序并没有执行他们修改的功能，此外，随着程序复杂度的增加这些简单的任务可能会随着开发不同版本的程序而变得越来越容易出错。也可能其他平台或者其他版本的库等。

The **make** program is intended to automate the mundane aspects of transforming source code into an executable. The advantages of **make** over scripts is that you can specify the relationships between the elements of your program to make, and it knows through these relationships and timestamps exactly what steps need to be redone to produce the desired program each time. Using this information, make can also optimize the build process avoiding unnecessary steps.

**make** 程序旨在将源码编译成为可执行文件的日常工作自动化，与脚本相比 **make** 的优势在于，你可以给 **make** 指定程序对象之间的关系，而且通过这些关系和时间戳，可以准确地知道每次生成程序的时候哪些步骤需要重新做。使用此信息，**make** 还优化了构建程序的过程而避免了一些不必要的步骤。

GNU make (and other variants of **make**) do precisely this. **make** defines a language for describing the relationships between source code, intermediate files, and executables. It also provides features to manage alternate configurations, implement reusable libraries of specifications, and parameterize processes with user-defined macros. In short, **make** can be considered the center of the development process by providing a roadmap of an application’s components and how they fit together.

GNU make （和其他一些变体）正是这样做的，**make** 定义了一种语言来描述代码、中间文件和可执行文件之间的关系。它还提供了一些功能：管理备用配置，实现规范的可复用的库，以及使用用户定义的宏来对过程参数化，简而言之，可以通过提供程序组件之间的路线图以及他们如何组织在一起的方式，将 **make** 视为开发流程的中心。

The specification that **make** uses is generally saved in a file named **makefile**. Here is a **makefile** to build the traditional “Hello, World” program:

**make** 的规范文件通常保存在名为 **makefile** 的文件中，下面是一个 **makefile** 文件，用以构建 **hello, world** 程序：

```makefile
hello: hello.c
    gcc hello.c -o hello
```

To build the program execute make by typing:

要编译程序的话只需执行命令：

    make

at the command prompt of your favorite shell. This will cause the make program to read the makefile and build the first target it finds there:

在你喜欢的 shell 中，这将导致 make 程序读取 makefile 文件来构建we文件中找到的第一个目标文件。

```sh
$ make
gcc hello.c -o hello
```

If a target is included as a command-line argument, that target is updated. If no command-line targets are given, then the first target in the file is used, called the default goal.

如果命令行参数中包含目标，那么将会更新该目标，如果命令行参数中没有给出目标，则使用文件中第一个目标，称为默认目标。

Typically the default goal in most makefiles is to build a program. This usually involves many steps. Often the source code for the program is incomplete and the source must be generated using utilities such as flex or bison. Next the source is compiled into binary object files (.o files for C/C++, .class files for Java, etc.). Then, for C/C++, the object files are bound together by a linker (usually invoked through the compiler, gcc) to form an executable program.

通常，默认目标在大多书的 makefile 中应该是构建一个程序，一般会引发很多步骤。通常程序得源码是不完整的，源码必须由一些工具来生成，比如 **flex** 或者 **bison**。然后源码将被编译成二进制目标文件 (C/C++ 生成 .o 文件，Java 生成 .class 文件)。再然后，对于 C/C++，将目标文件合在一起链接成为一个可执行文件（通常由编译器 gcc 调用）

Modifying any of the source files and reinvoking make will cause some, but usually not all, of these commands to be repeated so the source code changes are properly
incorporated into the executable. The specification file, or makefile, describes the relationship between the source, intermediate, and executable program files so that make can perform the minimum amount of work necessary to update the executable.

改动任何一个源代码文件，然后重新执行 make 将会导致一些（通常不会是全部）命令重复出现，所以源码得改动会适当的编译到可执行文件中。makefile 规范文件描述了代码、中间文件和可执行文件之间的关系，以便 make 可以执行最小的必要工作来更新可执行文件。

So the principle value of make comes from its ability to perform the complex series of commands necessary to build an application and to optimize these operations when possible to reduce the time taken by the edit-compile-debug cycle. Furthermore, make is flexible enough to be used anywhere one kind of file depends on another from traditional programming in C/C++ to Java, TEX, database management, and more.

所以 **make** 的核心价值在于其执行构建程序时的一系列复杂的必要命令的能力，而且尽可能地优化这些操作来减少 编辑-编译-调试 的开发周期中所需的时间。此外，**make** 足够灵活，可以在一个文件依赖于另一个文件的任何地方使用，比如，传统编程 C/C++ , Java, TEX, 数据库管理，等等。

## 目标和先决条件
 
## 参考资料

- Managing Projects with GNU Make