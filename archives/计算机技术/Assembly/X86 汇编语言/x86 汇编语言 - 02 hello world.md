# x86 汇编语言 - 02 hello world

[annotation]: <id> (b5387ae1-00df-4c1d-ad2b-ee87682f6a90)
[annotation]: <status> (public)
[annotation]: <create_time> (2021-03-02 13:49:45)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (汇编语言)
[annotation]: <comments> (false)
[annotation]: <topic> (x86 汇编语言)
[annotation]: <index> (2)
[annotation]: <url> (http://blog.ccyg.studio/article/b5387ae1-00df-4c1d-ad2b-ee87682f6a90)

## 重新编译 bochs

由于 bochs-2.6.11 gtk GUI 的源码有 bug，导致无法查看 堆栈，以及其他的一些调试工具，所以下面重新编译 bochs

有以下两个文件

`PKGBUILD`

```makefile
# Maintainer: Kyle Keen <keenerd@gmail.com>
# Contributor: Tom Newsom <Jeepster@gmx.co.uk>
# Contributor: Kevin Piche <kevin@archlinux.org>

pkgname=bochs
pkgver=2.6.11
pkgrel=1
pkgdesc="A portable x86 PC emulation software package, including GUI debugger"
arch=('x86_64')
url="http://bochs.sourceforge.net/"
license=('LGPL')
depends=('gcc-libs' 'libxrandr' 'libxpm' 'gtk2')
source=("https://downloads.sourceforge.net/sourceforge/$pkgname/$pkgname-$pkgver.tar.gz"
        "fix-build.patch")
sha256sums=('63897b41fbbbdfb1c492d3c4dee1edb4224282a07bbdf442a4a68c19bcc18862'
            'SKIP')

prepare() {
    cd "$srcdir/$pkgname-$pkgver"
    # 4.X kernel is basically 3.20
    sed -i 's/2\.6\*|3\.\*)/2.6*|3.*|4.*)/' configure*

    patch -p1 < ../fix-build.patch # https://sourceforge.net/p/bochs/bugs/1411/
}

build() {
    cd "$srcdir/$pkgname-$pkgver"

    ./configure \
        --prefix=/usr \
        --without-wx \
        --with-x11 \
        --with-x \
        --with-term \
        --disable-docbook \
        --enable-cpu-level=6 \
        --enable-fpu \
        --enable-3dnow \
        --enable-disasm \
        --enable-smp \
        --enable-x86-64 \
        --enable-avx \
        --enable-evex \
        --enable-long-phy-address \
        --enable-disasm \
        --enable-pcidev \
        --enable-usb \
        --enable-debugger \
        --with-sdl \
        --enable-x86-debugger \
        --enable-all-optimizations \
        --enable-plugins
    sed -i 's/^LIBS = /LIBS = -lpthread/g' Makefile
    make -j 1
}

package() {
    cd "$srcdir/$pkgname-$pkgver"
    make DESTDIR="$pkgdir" install
    install -Dm644 .bochsrc "$pkgdir/etc/bochsrc-sample.txt"
}

```

`fix-build.patch`

```diff
Description: Fix the build with SMP enabled
Origin: https://sourceforge.net/p/bochs/code/13778/

Index: bochs/bx_debug/dbg_main.cc
===================================================================
--- bochs/bx_debug/dbg_main.cc	(revision 13777)
+++ bochs/bx_debug/dbg_main.cc	(working copy)
@@ -1494,11 +1494,11 @@
 {
   char cpu_param_name[16];
 
-  Bit32u index = BX_ITLB_INDEX_OF(laddr);
+  Bit32u index = BX_CPU(dbg_cpu)->ITLB.get_index_of(laddr);
   sprintf(cpu_param_name, "ITLB.entry%d", index);
   bx_dbg_show_param_command(cpu_param_name, 0);
 
-  index = BX_DTLB_INDEX_OF(laddr, 0);
+  index = BX_CPU(dbg_cpu)->DTLB.get_index_of(laddr);
   sprintf(cpu_param_name, "DTLB.entry%d", index);
   bx_dbg_show_param_command(cpu_param_name, 0);
 }

Index: bochs/gui/gtk_enh_dbg_osdep.cc
===================================================================
--- bochs/gui/gtk_enh_dbg_osdep.cc
+++ bochs/gui/gtk_enh_dbg_osdep.cc
@@ -819,7 +819,7 @@ void ShowDListCols (int totcols)
     while (++i < firsthide)
         gtk_tree_view_column_set_visible(AllCols[i], TRUE);
     while (i < 23)
-        gtk_tree_view_column_set_visible(AllCols[i], FALSE);
+        gtk_tree_view_column_set_visible(AllCols[i++], FALSE);
 }

```

> 注意最后需要一个空行

然后执行 `makepkg -si` 重新安装 bochs

## 启动过程

处理器加电或者复位之后，如果硬盘是首选的启动设备，那么 **ROM-BIOS** 将试图读取硬盘的第一个扇区（编号从0开始），这个扇区就是主引导扇区 (MBR, Main Boot Sector)。

读取的主引导扇区数据有 512 字节，ROM-BIOS 程序将它加载到逻辑地址 `0x0000:0x7c00` 处，也就是物理地址 `0x07c00` 处，然后判断它是否有效。

一个有效的主引导扇区，其最后两个字节应该是 0x55 和 0xAA。ROM-BIOS 程序首先检测这两个标志，如果主引导扇区有效，则以一个段间转义指令 `jmp 0x0000:0x7c00` 跳转到那里继续执行。

一般主引导扇区程序用于加载操作系统内核，可能会有多级加载，毕竟 512 字节的代码可以实现的功能有限。

BIOS 的全称叫做 Base Input Output System，即基本输入输出系统。

---

## 实模式下的内存布局

| 起始地址  | 结束地址  | 大小     | 用途               |
| --------- | --------- | -------- | ------------------ |
| `0x000`   | `0x3FF`   | 1KB      | 中断向量表         |
| `0x400`   | `0x4FF`   | 256B     | BIOS 数据区        |
| `0x500`   | `0x7BFF`  | 29.75 KB | 可用区域           |
| `0x7C00`  | `0x7DFF`  | 512B     | MBR 加载区域       |
| `0x7E00`  | `0x9FBFF` | 607.6KB  | 可用区域           |
| `0x9FC00` | `0x9FFFF` | 1KB      | 扩展 BIOS 数据区   |
| `0xA0000` | `0xAFFFF` | 64KB     | 用于彩色显示适配器 |
| `0xB0000` | `0xB7FFF` | 32KB     | 用于黑白显示适配器 |
| `0xB8000` | `0xBFFFF` | 32KB     | 用于文本显示适配器 |
| `0xC0000` | `0xC7FFF` | 32KB     | 显示适配器 BIOS    |
| `0xC8000` | `0xEFFFF` | 160KB    | 映射内存           |
| `0xF0000` | `0xFFFEF` | 64KB-16B | 系统 BIOS          |
| `0xFFFF0` | `0xFFFFF` | 16B      | 系统 BIOS 入口地址 |

- 中断向量表 (IVT Interrupt Vector Table)
- 映射内存表示：映射硬件适配器 ROM 或者 内存映射式 I/O
- BIOS 入口地址，此处的 16 字节的内容是跳转指令 `jmp f000:e05b`

可以看到，我们能够使用的内存区域只有两块，`0x500` ~ `0x7BFF` 和 `0x7E00` ~ `0x9FBFF`，这两个内存区域是一定可用的，如果要使用超过 1M 内存区域之外的内存，这样每个机器的内存大小可能都不一样，所以后面的内存就不一定有了。

---

## 为什么是 0xb800

可以看到 `0xb8000` 开始的 32KB 用于文本显示适配器，也就是说这 32K 的内存区域是用来操作显示器的，一般而言，操作硬件都需要输入和输出操作，但是显示器对于计算机来说太重要了。所以就把这块内存映射到了显示器，用来显示字符。`0xb8000` - `0xbffff` 是留给显卡的，由显卡来提供。

由于历史原因，所有在个人计算机上使用的显卡，在加电自检后都会把自己初始化到 80x25 的文本模式，在这种模式下可以显示 25 行，每行 80 个字符，每屏总共 2000 个字符。

一个字符由连个字节控制，前一个字节标识字符，后一个字节标识样式，具体的样式如下：

字符串显示的格式：

- 高四位背景色：| K | R | G | B |
- 底四位前景色：| I | R | G | B |
- K=0：背景不闪烁
- K=1：背景闪烁
- I=1：浅色
- I=0：深色

---

## 为什么是 `0x7c00`？

1981 年 8 月， IBM 公司生产了世界上第一台个人计算机 PC 5150 ，所以它就是现代 x86 个人计算机兼容机的祖先。说到有关历史的东西，不给来点真相就感觉气场不足。

既然 Intel 开发手册中没有相关说明，那咱们就朝其他方向找答案，换句话说，既然不是 CPU 的硬性规定，那很可能就是代码中写死的。为了搞清楚。`0x7c00` 是哪里来的，咱们先探索下 IBM PC 5150 BIOS 的秘密。

0x7c00 最早出现在 IBM 公司出产的个人电脑 PC 5150 ROM BIOS 的INT19H 中断处理程序中，通电开机之后，BIOS 处理程序开始自检，随后，调用 BIOS 中断 `0x19h` ，即 `call int 19h`。在此中断处理函数中， BIOS 要检测这台计算机有多少硬盘或软盘，如果检测到了任何可用的磁盘， BIOS 就把它的第一个扇区加载到 `0x7c00`。它是属于 BIOS 中的规范。既然是 BIOS 中的规范，那肯定是 IBM PC 5150 BIOS 开发团队规定的这个数。

8086 CPU 要求物理地址。`0x0～Ox3FF` 存放中断向量表，所以此处不能动了，再选新的地方看看。

按 DOS 1.0 要求的最小内存 32KB 来说， MBR 希望给人家尽可能多的预留空间，这样也是保全自己的作法，免得过早被覆盖。所以MBR 只能放在 32KB 的末尾。

MBR 本身也是程序，是程序就要用到栈，栈也是在内存中的，MBR 虽然本身只有 512 字节，但还要为其所用的栈分配点空间，所以其实际所用的内存空间要大于 512 字节，当时估计 1KB 内存够用了。

结合以上三点，选择 32KB 中的最后 1KB 最为合适，那此地址是多少呢？ 32KB 换算为十六进制为 `0x8000`, 减去 `1KB(0x400)` 的话，等于 `0x7c00`。这就是倍受质疑的 `0x7c00` 的由来。

---

## hello world

```s
mov ax, 3
int 0x10 ; 设置显示模式为文本模式（清屏）

mov ax, 0xb800
mov ds, ax

mov byte [0], 'h'
mov byte [2], 'e'
mov byte [4], 'l'
mov byte [6], 'l'
mov byte [8], 'o'
mov byte [10], ','
mov byte [12], ' '
mov byte [14], 'w'
mov byte [16], 'o'
mov byte [18], 'r'
mov byte [20], 'l'
mov byte [22], 'd'


halt:
    jmp halt

times 510 - ($ - $$) db 0
db 0x55, 0xaa
```

## 参考资料 

- [李忠 - X86汇编语言](https://book.douban.com/subject/20492528/)
- [操作系统真象还原](https://book.douban.com/subject/26745156/)

