# GCC 汇编分析

[annotation]: [id] (6afa7afe-3312-4bc9-99aa-af1256e5db5b)
[annotation]: [status] (public)
[annotation]: [create_time] (2021-07-09 17:30:33)
[annotation]: [category] (计算机技术)
[annotation]: [tags] (汇编语言|C/C++)
[annotation]: [comments] (false)
[annotation]: [url] (http://blog.ccyg.studio/article/6afa7afe-3312-4bc9-99aa-af1256e5db5b)

## hello world

相信大多数人的第一个程序，都是下面的这段代码。或者差不多是这样。不过编译器最终生成的汇编代码是怎样的，是一个比较有趣的事情，那么这里我们分析一下。

```c
#include <stdio.h>

int main()
{
    printf("hello world!!!\n");
    return 0;
}
```

我们可以用下面的命令生成汇编代码：

    gcc -S hello.c

```s
	.file	"hello.c"
	.text
	.section	.rodata
.LC0:
	.string	"hello world!!!"
	.text
	.globl	main
	.type	main, @function
main:
.LFB0:
	.cfi_startproc
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset 6, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register 6
	leaq	.LC0(%rip), %rax
	movq	%rax, %rdi
	call	puts@PLT
	movl	$0, %eax
	popq	%rbp
	.cfi_def_cfa 7, 8
	ret
	.cfi_endproc
.LFE0:
	.size	main, .-main
	.ident	"GCC: (GNU) 11.1.0"
	.section	.note.GNU-stack,"",@progbits
```

这样生成的代码是 64 位的代码，我比较关心 32 位的代码，如果要生成 32 位的代码，可以加上 -m32

    gcc -m32 -S hello.c

生成的代码如下：

```s
	.file	"hello.c"
	.text
	.section	.rodata
.LC0:
	.string	"hello world!!!"
	.text
	.globl	main
	.type	main, @function
main:
.LFB0:
	.cfi_startproc
	leal	4(%esp), %ecx
	.cfi_def_cfa 1, 0
	andl	$-16, %esp
	pushl	-4(%ecx)
	pushl	%ebp
	movl	%esp, %ebp
	.cfi_escape 0x10,0x5,0x2,0x75,0
	pushl	%ebx
	pushl	%ecx
	.cfi_escape 0xf,0x3,0x75,0x78,0x6
	.cfi_escape 0x10,0x3,0x2,0x75,0x7c
	call	__x86.get_pc_thunk.ax
	addl	$_GLOBAL_OFFSET_TABLE_, %eax
	subl	$12, %esp
	leal	.LC0@GOTOFF(%eax), %edx
	pushl	%edx
	movl	%eax, %ebx
	call	puts@PLT
	addl	$16, %esp
	movl	$0, %eax
	leal	-8(%ebp), %esp
	popl	%ecx
	.cfi_restore 1
	.cfi_def_cfa 1, 0
	popl	%ebx
	.cfi_restore 3
	popl	%ebp
	.cfi_restore 5
	leal	-4(%ecx), %esp
	.cfi_def_cfa 4, 4
	ret
	.cfi_endproc
.LFE0:
	.size	main, .-main
	.section	.text.__x86.get_pc_thunk.ax,"axG",@progbits,__x86.get_pc_thunk.ax,comdat
	.globl	__x86.get_pc_thunk.ax
	.hidden	__x86.get_pc_thunk.ax
	.type	__x86.get_pc_thunk.ax, @function
__x86.get_pc_thunk.ax:
.LFB1:
	.cfi_startproc
	movl	(%esp), %eax
	ret
	.cfi_endproc
.LFE1:
	.ident	"GCC: (GNU) 11.1.0"
	.section	.note.GNU-stack,"",@progbits
```

这样生成的汇编代码特别乱，对于理解程序逻辑几乎没有帮助。不过我们还是能够从中得到一些重要的信息。

## Call Frame Information (CFI)

首先，我们看到了有好多 `.cfi` 开头的指令，这些是 `gas` 的汇编伪指令，是 DWARF(Debugging With Attributed Record Formats) 2.0 定义的函数栈信息，是一种调试信息。可以在调用异常的时候回溯栈。

例如：如果函数 `A` 调用了函数 `B`，然后调用了一个公共的函数 `C`，但是函数 `C` 调用失败了。你现在想知道哪个函数调用了 `C`，通过调用栈信息，就可以知道是 `B` 调用的，然后你可以想知道哪个函数调用了 `B` 等等。

由于这些信息对于程序逻辑不起作用，可以通过 `-fno-asynchronous-unwind-tables` 去掉这些信息。所以可以去掉这些信息，再次生成汇编代码。

    gcc -m32 -S hello.c -fno-asynchronous-unwind-tables

得到如下的代码：

```s
	.file	"hello.c"
	.text
	.section	.rodata
.LC0:
	.string	"hello world!!!"
	.text
	.globl	main
	.type	main, @function
main:
	leal	4(%esp), %ecx
	andl	$-16, %esp
	pushl	-4(%ecx)
	pushl	%ebp
	movl	%esp, %ebp
	pushl	%ebx
	pushl	%ecx
	call	__x86.get_pc_thunk.ax
	addl	$_GLOBAL_OFFSET_TABLE_, %eax
	subl	$12, %esp
	leal	.LC0@GOTOFF(%eax), %edx
	pushl	%edx
	movl	%eax, %ebx
	call	puts@PLT
	addl	$16, %esp
	movl	$0, %eax
	leal	-8(%ebp), %esp
	popl	%ecx
	popl	%ebx
	popl	%ebp
	leal	-4(%ecx), %esp
	ret
	.size	main, .-main
	.section	.text.__x86.get_pc_thunk.ax,"axG",@progbits,__x86.get_pc_thunk.ax,comdat
	.globl	__x86.get_pc_thunk.ax
	.hidden	__x86.get_pc_thunk.ax
	.type	__x86.get_pc_thunk.ax, @function
__x86.get_pc_thunk.ax:
	movl	(%esp), %eax
	ret
	.ident	"GCC: (GNU) 11.1.0"
	.section	.note.GNU-stack,"",@progbits
```

## Position Independent Code (PIC)

去掉了调用栈信息之后，我们还观察到一个特别明显的函数调用 `__x86.get_pc_thunk.ax`，这个函数的功能大致相当于：

```s
mov eax, eip;
```

但是，由于这个指令在 386 上是非法的，所以使用了这个函数调用，在栈中得到 eip 的值。

这个调用是为了生成位置无关的代码，在动态链接的时候，程序需要得到符号表的位置，通过符号表来得到具体符号的位置，比如程序中的 `printf` 函数就是一个外部符号。

这个功能同样也和程序逻辑无关，可以通过 `-fno-pic` 来去掉这些信息，再次生成代码：

    gcc -m32 -S hello.c -fno-asynchronous-unwind-tables -fno-pic

得到如下代码：

```s
	.file	"hello.c"
	.text
	.section	.rodata
.LC0:
	.string	"hello world!!!"
	.text
	.globl	main
	.type	main, @function
main:
	leal	4(%esp), %ecx
	andl	$-16, %esp
	pushl	-4(%ecx)
	pushl	%ebp
	movl	%esp, %ebp
	pushl	%ecx
	subl	$4, %esp
	subl	$12, %esp
	pushl	$.LC0
	call	puts
	addl	$16, %esp
	movl	$0, %eax
	movl	-4(%ebp), %ecx
	leave
	leal	-4(%ecx), %esp
	ret
	.size	main, .-main
	.ident	"GCC: (GNU) 11.1.0"
	.section	.note.GNU-stack,"",@progbits
```

这次看起来亲切多了。很明显看到它调用了 `puts` 函数，而且很明显的可以看到 `hello world!!!` 后面的换行消失了。刚好就是调用了这个函数的原因。

`puts` 函数的功能就是输出字符串，然后换行。

## intel 语法

如果大家对 AT&T 的语法格式不熟悉，还可以加上选项 `-masm=intel` 来生成 Intel 语法的汇编代码。

    gcc -m32 -S hello.c -fno-asynchronous-unwind-tables -fno-pic -masm=intel

结果如下：

```s
	.file	"hello.c"
	.intel_syntax noprefix
	.text
	.section	.rodata
.LC0:
	.string	"hello world!!!"
	.text
	.globl	main
	.type	main, @function
main:
	lea	ecx, [esp+4]
	and	esp, -16
	push	DWORD PTR [ecx-4]
	push	ebp
	mov	ebp, esp
	push	ecx
	sub	esp, 4
	sub	esp, 12
	push	OFFSET FLAT:.LC0
	call	puts
	add	esp, 16
	mov	eax, 0
	mov	ecx, DWORD PTR [ebp-4]
	leave
	lea	esp, [ecx-4]
	ret
	.size	main, .-main
	.ident	"GCC: (GNU) 11.1.0"
	.section	.note.GNU-stack,"",@progbits
```

## 栈对齐选项

我们还看到 `main` 函数开始的地方 执行了：

```s
and esp, -16
```

这个代码不是对栈的加减操作，而是 `and` 按位与，所以比较奇怪。

我们可以将 -16 写成 16 进制补码，也就是 `0xfffffff0`，算起来也很简单，就是 0x00000000 - 0x10 = 0xfffffff0。

也就是说，这个指令，将 esp 最低四位置为了 0，也就完成了对齐到 16 字节。

同样，我们也可以通过选项 `-mpreferred-stack-boundary=2` 来去掉这个特性。

再次生成代码：

    gcc -m32 -S hello.c -fno-asynchronous-unwind-tables -fno-pic -masm=intel -mpreferred-stack-boundary=2

结果如下：

```s
	.file	"hello.c"
	.intel_syntax noprefix
	.text
	.section	.rodata
.LC0:
	.string	"hello world!!!"
	.text
	.globl	main
	.type	main, @function
main:
	push	ebp
	mov	ebp, esp
	push	OFFSET FLAT:.LC0
	call	puts
	add	esp, 4
	mov	eax, 0
	leave
	ret
	.size	main, .-main
	.ident	"GCC: (GNU) 11.1.0"
	.section	.note.GNU-stack,"",@progbits
```

## 函数框架与返回值

现在，没多少代码了，前面的数据定义很好理解，我们直接从 `main` 函数开始分析。

```s
main:
	push	ebp # 保存 ebp 的值
	mov	ebp, esp # 将 esp 的值保存到 ebp 中

    # C 语言调用时 参数和局部变量 存储在 栈中
    # 所以需要记录函数开始时栈的位置
    # 在返回前恢复

	push	OFFSET FLAT:.LC0 # 输入参数
	call	puts # 调用函数
	add	esp, 4 # 调用返回恢复栈 对应上面的 push

	mov	eax, 0 # 函数的返回值存储在 eax 中

	leave
    # leave 等于，恢复栈的位置
    # mov esp, ebp
    # pop ebp
	ret # 函数返回
```

## 局部变量

下面我们分析一个稍微复杂一点的代码，C 代码如下：

```c
#include <stdio.h>

int add(int a, int b)
{
    int c = a + b;
    return c;
}

int main()
{
    int i = 5;
    int j = 10;
    int k = add(i, j);
    printf("%d + %d = %d\n", i, j, k);
    return 0;
}
```

代码本身没有多少难度，我们来看生成的汇编代码；简单起见，我直接在代码中写注释了，以及加了一些易于理解的空行，代码如下：

```s
	.file	"hello.c"
	.intel_syntax noprefix
	.text
	.globl	add
	.type	add, @function
add: # add 函数
	push	ebp
	mov	ebp, esp # 函数开始

	sub	esp, 4 # 从 栈中开辟 4 个字节的空间，用于变量 c

	mov	edx, DWORD PTR [ebp+8] # 参数 a
	mov	eax, DWORD PTR [ebp+12] # 参数 b

	add	eax, edx # 执行加法

	mov	DWORD PTR [ebp-4], eax # 将结果存储到 c

	mov	eax, DWORD PTR [ebp-4] # 将 c 挪到 eax 中，
    # C 语言规定，函数返回值存储在 eax 中

    # 函数结束
	leave
	ret
	.size	add, .-add
	.section	.rodata

.LC0:
	.string	"%d + %d = %d\n"
	.text
	.globl	main
	.type	main, @function
main:
	push	ebp
	mov	ebp, esp # 函数开始

	sub	esp, 12 # 栈中开辟 12 个字节
    # 三个局部变量，每个变量 4 个字节

	mov	DWORD PTR [ebp-12], 5 # int i = 5;
	mov	DWORD PTR [ebp-8], 10 # int j = 10;

	push	DWORD PTR [ebp-8] # push j
	push	DWORD PTR [ebp-12] # push i
    # 可以看到函数的参数是 从右向左 依次压入栈中的

	call	add # 调用 add 函数
	add	esp, 8 # 恢复栈到调用之前，对应 push 的两个参数

	mov	DWORD PTR [ebp-4], eax 
    # 函数的返回值在 eax 中，也就对应下面这行
    # int k = add(i, j);

	push	DWORD PTR [ebp-4] # 参数 k
	push	DWORD PTR [ebp-8] # 参数 j
	push	DWORD PTR [ebp-12] # 参数 i
    # 也可以看到参数传递的顺序

	push	OFFSET FLAT:.LC0 # 参数 %d + %d = %d
	call	printf # 调用 printf 函数
	add	esp, 16 # 恢复栈，去掉参数

	mov	eax, 0 # 函数返回值存储在 eax 中

	leave # 函数结束
	ret

	.size	main, .-main
	.ident	"GCC: (GNU) 11.1.0"
	.section	.note.GNU-stack,"",@progbits
```

C 语言函数的参数和局部变量，都存储在栈中，这也就很容易理解局部变量的生命周期了，函数返回之后，栈的值就恢复到了刚开始的状态，所以，函数调用结束后，存储局部变量的位置，会被其他的调用参数和局部变量覆盖，也就结束了生命周期。

## 其他

当前 C/C++ 语言还有众多的其他特性，比如结构体，函数重载，虚基类，等等，后面再分析吧。

## 参考资料

- <https://stackoverflow.com/questions/2529185/what-are-cfi-directives-in-gnu-assembler-gas-used-for>
- <https://sourceware.org/binutils/docs-2.31/as/CFI-directives.html>
- <https://www.cnblogs.com/friedCoder/articles/12374666.html>
- <https://baike.baidu.com/item/puts>
- <https://stackoverflow.com/questions/23309863/why-does-gcc-produce-andl-16>