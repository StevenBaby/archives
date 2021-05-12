# PC 汇编语言

[annotation]: [id] (18e25519-65e5-4ae3-961d-fb6dce6a9ce9)
[annotation]: [status] (public)
[annotation]: [create_time] (2021-05-11 14:15:54)
[annotation]: [category] (读书笔记)
[annotation]: [tags] (汇编语言)
[annotation]: [comments] (false)
[annotation]: [url] (http://blog.ccyg.studio/article/18e25519-65e5-4ae3-961d-fb6dce6a9ce9)

## 结构体和 C++

结构体是 C 语言将相互有关联的数据组合到一个变量中的一种方式。这个技术有几个优势：

- 相关数据定义更加紧密使得代码更加清晰
- 简化参数传递，将多个参数合在一起
- 增强了代码的内聚

站在汇编的角度，结构可以看成是数组，其中的元素大小不一。

例如：

```s
typedef struct S
{
    short x;
    int y;
    double z;
} S;

int test()
{
    S s;
    s.x = 1;
    s.y = 2;
    s.z = 4.0;
}
```

将翻译成如下的汇编代码：

```s
	.file	"teststruct.c"
	.text
	.globl	test
	.type	test, @function
test:
	pushl	%ebp
	movl	%esp, %ebp
	subl	$16, %esp
	call	__x86.get_pc_thunk.ax
	addl	$_GLOBAL_OFFSET_TABLE_, %eax
	movw	$1, -16(%ebp)
	movl	$2, -12(%ebp)
	fldl	.LC0@GOTOFF(%eax)
	fstpl	-8(%ebp)
	nop
	leave
	ret
	.size	test, .-test
	.section	.rodata
	.align 8
.LC0:
	.long	0
	.long	1074790400
	.section	.text.__x86.get_pc_thunk.ax,"axG",@progbits,__x86.get_pc_thunk.ax,comdat
	.globl	__x86.get_pc_thunk.ax
	.hidden	__x86.get_pc_thunk.ax
	.type	__x86.get_pc_thunk.ax, @function
__x86.get_pc_thunk.ax:
	movl	(%esp), %eax
	ret
	.ident	"GCC: (GNU) 10.2.0"
	.section	.note.GNU-stack,"",@progbits
```

于是结构体只是一种人为的约定，那个内存位置保存什么数据。具体的结构只有在 C 编译器中转换为汇编代码。

C++ 特性的实现，也就是从 C++ 转换到汇编的过程，不同的编译器，实现方式大有不同。所以下面只能说说共性。

### 函数重载

C++ 允许不同的函数使用相同的名字，当多个函数使用同一个名字时，叫做函数重载。对于 C 来说，如果函数名相同的话，连接器就会报错。C++ 也使用相同的链接程序。不过为了避免错误，C++ 需要为每个名字添加标签以区别它们。不过，不同的编译器对于 C++ 的名字重载没有统一的做法。

### 引用

引用是 C++ 的另一特性，允许传递参数而避免使用指针。例如

```cpp
void f(int &x)
{
    x++;
}

int main(){
    int y = 5;
    f(y);
    printf("%d\n", y);
    return 0;
}
```

但是实际上，传递给函数的还是指针，只不过编译器将这部分对程序员隐藏了起来。

### 内联函数

内联函数是 C++ 的另一特性，内联函数的使命是取代简单的宏函数。用宏代替普通函数是为了尽可能地提高效率。因为某些简单的函数，函数调用的入栈出栈操作可能比本身函数还要复杂，那么对于多次调用的函数来说，就不划算了。这时候可以使用宏来代替，因为宏只是简单的替换。这样可以省去函数调用的代价。

内联函数有两大优点，首先，内联函数是高效的，无需函数调用，没有分支，其次，内联函数使用更少的代码。

不过一旦内联函数有变化，所有与之相关的代码都需要重新编译，不过对于宏来说，不也需要重新编译吗。

### 类

类对象可以看成是结构体 + 函数，但是函数并没有存储在结构中。但是成员函数又不同于普通函数。它们传递一个隐藏的参数，这个参数指向具体调用的对象。类似于 Python 类中的 `self` 参数，不过 C++ 把这个参数隐藏了，取而代之的是 `this`。事实上 `self` 或者 `this` 确实是一个冗余参数，因为编译器确实知道具体调用的对象。

### 继承和多态

使用 `virtual` 关键字可以打开多态机制。一旦有了 `virtual` 关键字，类对象会多一个字段指针，指向虚拟函数表。对于带有 `virtual` 的函数，执行的时候查找这个表找到对应的函数。

## 参考资料

- <https://book.douban.com/subject/26892163/>
