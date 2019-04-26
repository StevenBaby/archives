# 安装 ArchLinux 到U盘（四）安装Archlinux

[annotation]: <id> (4f6cfa0a-ad98-4adb-af08-79a8a5b1d674)
[annotation]: <create_time> (2018-01-14 18:09:00)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (操作系统|Linux)
[annotation]: <status> (public)
[annotation]: <topics> (安装 ArchLinux 到U盘)
[annotation]: <comments> (true)

> 原文链接：<http://blog.ccyg.studio/article/4f6cfa0a-ad98-4adb-af08-79a8a5b1d674>

---


>再次重申：安装过程会格式化U盘，内有资料，请先备份，如有遗失，概不负责！！！

## 启动虚拟机

点击 Power on this virtual machine 启动 Installer 虚拟机

![01](https://upload-images.jianshu.io/upload_images/406169-1ab68f64bb89af24.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击 Enter 启动Archlinux安装镜像

![02](https://upload-images.jianshu.io/upload_images/406169-3cd63a6db248ea30.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

等待启动完毕，输入 `lsblk` 应该显示下面的内容

![03](https://upload-images.jianshu.io/upload_images/406169-63c993f0b9cf3e85.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

****

## 连接U盘到虚拟机

这时候U盘还没有连接至虚拟机，点击菜单VM > Removable Devices > USB Device > Connect(Disconnect from Host)，将U盘连接至虚拟机，其中 **USB Device** 是U盘的名称，U盘不同名称应该也是不同的。

![04](https://upload-images.jianshu.io/upload_images/406169-a5fd0d87f16cfc68.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

然后输入 `lsblk` 应该显示下面的内容，可以看到已经有 `sdb` 这个磁盘了

![05](https://upload-images.jianshu.io/upload_images/406169-75b7ffa750753c85.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

****

## U盘分区

以下的内容基于Archlinux官网的wiki，如果有不明白的地方可以参考[官方Wiki](https://wiki.archlinux.org/index.php/Beginners%27_Guide)

这里我们选择分三个区：

- EFI分区，用于UEFI启动，必选，否则系统可能会在最新的计算机中无法启动
- 根分区，用于安装Archlinux
- U盘分区，可当作U盘使用，便于在Windows系统中安全的移除U盘

输入 `fdisk /dev/sdb` 进入分区程序

![06](https://upload-images.jianshu.io/upload_images/406169-00080b6184c2daf7.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `o` 开始分区

![07](https://upload-images.jianshu.io/upload_images/406169-2776722b5676d094.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `n` 新建EFI分区

![08](https://upload-images.jianshu.io/upload_images/406169-caa964e1e15e0771.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击 `Enter` 选择默认分区序号

![09](https://upload-images.jianshu.io/upload_images/406169-e52f2e76e9d627c8.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击 `Enter` 选择默认起始扇区

![10](https://upload-images.jianshu.io/upload_images/406169-8492654b2cbe063d.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `+128M` 新建EFI分区大小为128M

![11](https://upload-images.jianshu.io/upload_images/406169-ec26e70af30d30e6.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `n` 新建根分区

![12](https://upload-images.jianshu.io/upload_images/406169-36b7e7d22f451dcf.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击 `Enter` 选择默认分区序号

![13](https://upload-images.jianshu.io/upload_images/406169-ca1542ff5dc18958.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击 `Enter` 选择默认起始扇区

![14](https://upload-images.jianshu.io/upload_images/406169-dd17433561d1265e.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `+20G` 新建根分区大小为20G，该分区容量可根据U盘容量自行决定，不一定非得是20G

![15](https://upload-images.jianshu.io/upload_images/406169-d8ce4f99fa791a41.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `n` 新建根分区

![16](https://upload-images.jianshu.io/upload_images/406169-9b85b9917db22d57.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击 `Enter` 选择默认分区序号

![17](https://upload-images.jianshu.io/upload_images/406169-07ddfd4b10c2478b.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击 `Enter` 选择默认起始扇区

![18](https://upload-images.jianshu.io/upload_images/406169-15e993a633feb628.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击 `Enter` 选择默认容量，剩余全部未分配分区

![19](https://upload-images.jianshu.io/upload_images/406169-827fee9fcf1c52c0.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `p` 查看分区信息

![20](https://upload-images.jianshu.io/upload_images/406169-0b679ddca1a5bbbf.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `w` 写入分区信息

![21](https://upload-images.jianshu.io/upload_images/406169-25d2efc61dbb9046.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `lsblk` 可以看到已经有 `sdb` 磁盘，下面有 `sdb1`，`sdb2`，`sdb3` 三个分区

![22](https://upload-images.jianshu.io/upload_images/406169-3ce01130c1a5b6d4.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

****

## 格式化分区

输入 `mkfs.fat -F 32 /dev/sdb1` 格式化 `sdb1` 为FAT32格式

![23](https://upload-images.jianshu.io/upload_images/406169-f585e80bee7eba5a.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `mkfs.fat -F 32 /dev/sdb3` 格式化 `sdb3` 为FAT32格式

![24](https://upload-images.jianshu.io/upload_images/406169-cc95697a538a0c20.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `mkfs.ext4 /dev/sdb2` 格式化 `sdb2` 为ext4格式，如果出现 *Proceed anyway?*，输入y继续格式化

![25](https://upload-images.jianshu.io/upload_images/406169-f2d133f9f8dd9813.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

****

## 挂载分区

输入 `mount /dev/sdb2 /mnt` 挂载 `sdb2` 到 `/mnt`

![26](https://upload-images.jianshu.io/upload_images/406169-0385cb123748b02f.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `mkdir -p /mnt/boot/efi` 创建 `/mnt/boot/efi` 目录

![27](https://upload-images.jianshu.io/upload_images/406169-b38f79a6187f3010.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `mount /dev/sdb1 /mnt/boot/efi` 挂载 `sdb1` 到 `/mnt/boot/efi`

![28](https://upload-images.jianshu.io/upload_images/406169-b73fa361b1ec517b.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

`sdb3` U盘分区无需挂载

****

> 关于文件编辑器：文章中所有的编辑器一律采用 `nano` 作为编辑器，主要是 nano 编辑器足够简单，防止一些人可能不是特别会使用其他的编辑器，例如 `vim`。

## 选择镜像

> 这步非必选，可以直接跳转至下一步进行安装，如果发现下载速度不是很快，可以再回到这里编辑镜像，然后再试。

输入 `cd /etc/pacman.d` 选择目录

![29](https://upload-images.jianshu.io/upload_images/406169-44eed785d1e74b6b.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `cp mirrorlist mirrorlist.bk` 将 mirrorlist 拷贝到 mirrorlist.bk

![30](https://upload-images.jianshu.io/upload_images/406169-4c5da833c5e355f2.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `cat mirrorlist.bk | grep China -A 1 | grep -v '-' > mirrorlist` 将所有中国的镜像写入 mirrorlist

![31](https://upload-images.jianshu.io/upload_images/406169-986fd20036b5785e.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `nano mirrorlist` 编辑镜像列表

![32](https://upload-images.jianshu.io/upload_images/406169-5ffe9e4601326f69.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

经测试，清华和163的镜像是最快的，这里可以根据实际测试来决定选择哪一个。可以在 Server 前面写入 `#` 来注释掉该镜像。

![33](https://upload-images.jianshu.io/upload_images/406169-c85ef27d5d496436.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

编辑完成之后 点击 `CTRL + X` 退出编辑

点击 `y`

![30](https://upload-images.jianshu.io/upload_images/406169-5a59de88e6056b8c.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击 `Enter`，保存文件

![31](https://upload-images.jianshu.io/upload_images/406169-e66c6358dc15de06.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

****

## 安装系统

输入 `pacstrap -i /mnt base base-devel ntfs-3g` 安装系统，然后点击 `Enter`
![34](https://upload-images.jianshu.io/upload_images/406169-7460bf9339250b2a.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击 `Enter`

![35](https://upload-images.jianshu.io/upload_images/406169-98543df3e0d98ef9.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击 `Enter`

![36](https://upload-images.jianshu.io/upload_images/406169-d462cce01dadb0cf.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

然后静静地等待安装完成。

![37](https://upload-images.jianshu.io/upload_images/406169-ae4a4b68120629ab.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

****

## 配置系统

### 基本配置

输入 `genfstab -U -p /mnt > /mnt/etc/fstab` 生成文件系统表

![38](https://upload-images.jianshu.io/upload_images/406169-1c45b5e41c231724.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `arch-chroot /mnt` 进入新系统

![39](https://upload-images.jianshu.io/upload_images/406169-9e8d235e481e03d6.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `nano /etc/locale.gen` 选择文字编码

![40](https://upload-images.jianshu.io/upload_images/406169-7657f58231c43eef.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

将 zh_CN 开头的行全部取消注释，再找到 en_US.UTF-8 UTF-8也取消注释。 编辑完成之后保存。nano 的使用方法不再赘述

输入 `locale-gen`

![41](https://upload-images.jianshu.io/upload_images/406169-85d62d9b622f02e0.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `nano /etc/locale.conf` 在文件中写入 `LANG=en_US.UTF-8` 保存

![42](https://upload-images.jianshu.io/upload_images/406169-f2b148240564763c.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `rm /etc/localtime` 删除原 UTC 时区

![43](https://upload-images.jianshu.io/upload_images/406169-03b5e72809ea0f36.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime`
设置计算机系统时区为上海

![44](https://upload-images.jianshu.io/upload_images/406169-30f3c9a47eeef7df.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `hwclock --systohc --localtime` 设置硬件时间为本地时间

![45](https://upload-images.jianshu.io/upload_images/406169-c2251846c6c01d94.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `echo steven > /etc/hostname` 将主机名配置成 steven，这个名称可以自行更改

![46](https://upload-images.jianshu.io/upload_images/406169-8a36773a3e8d79c3.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `nano /etc/mkinitcpio.conf` 找到下面这行

![47](https://upload-images.jianshu.io/upload_images/406169-1602ab125aa01cbd.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

将 `block` 写到 `udev` 之后，然后保存，这样做就是为了让usb在启动的之后首先加载

![48](https://upload-images.jianshu.io/upload_images/406169-def22ffa18029fe0.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `mkinitcpio -p linux` ，生成启动镜像


![49](https://upload-images.jianshu.io/upload_images/406169-63d53c1bf7b3fe8d.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `passwd` 设置 root 用户的密码，注意输入密码时没有回显。

![50](https://upload-images.jianshu.io/upload_images/406169-e083063d54fba8af.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 配置网络

输入 `pacman -S zd1211-firmware` 安装无线网卡驱动

![51](https://upload-images.jianshu.io/upload_images/406169-b5d9886c716d4bb2.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


输入 `pacman -S iw wpa_supplicant wireless_tools net-tools` 安装网络工具

![52](https://upload-images.jianshu.io/upload_images/406169-477cc71cdb0d6446.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `pacman -S dialog` 安装终端对话框

![53](https://upload-images.jianshu.io/upload_images/406169-ff5192e196f60422.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 配置引导

### 配置BIOS(legacy)引导

输入 `pacman -S grub` 安装引导程序

![54](https://upload-images.jianshu.io/upload_images/406169-67b9fc93cd55b214.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `grub-install --target=i386-pc /dev/sdb` 安装BIOS引导

![55](https://upload-images.jianshu.io/upload_images/406169-c969631bcdccf0c8.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `blkid` , 将 sdb2 的 UUID 记下来 

![56](https://upload-images.jianshu.io/upload_images/406169-995aaf9824afa26d.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这里 UUID 是 97b5e415-46ab-4e35-a804-6ddaez5793ac，每个分区的UUID应该都是不同的，下面具体根据自己的UUID来做修改，这是为了用 UUID 做标识来启动操作系统，否则换了电脑硬盘标签变化就不能启动了

输入 `nano /boot/grub/grub.cfg` , 修改grub配置文件

![57](https://upload-images.jianshu.io/upload_images/406169-e51b592844a88a9d.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

将所有出现的UUID全部改成 sdb2 的UUID，过程略复杂，谨慎修改，然后保存

![58](https://upload-images.jianshu.io/upload_images/406169-dacb43e18ff8a9b4.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### 测试BIOS(legacy)引导

输入 `exit` 退出新系统

![59](https://upload-images.jianshu.io/upload_images/406169-4e2a98f75a577c46.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `shutdown -h now` 关闭 Installer 虚拟机

![60](https://upload-images.jianshu.io/upload_images/406169-6042362cdc5451e1.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 新建测试虚拟机

参考[新建虚拟机](./206f744b-1d67-4afa-b25b-76d66c78e95f)

选择安装源时，选 I will install the operating system later.

![61](https://upload-images.jianshu.io/upload_images/406169-0b8fb4e2341a0dc1.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

名称写成 Boot，或者可以自定义

![62](https://upload-images.jianshu.io/upload_images/406169-ecadb533e3c4acba.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

选择磁盘时，选择 Use a physical disk(for advanced users)

![63](https://upload-images.jianshu.io/upload_images/406169-c5c715f2df127363.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

然后选择 PhysicalDrive1，选择Use individual partitions

![64](https://upload-images.jianshu.io/upload_images/406169-5d00ce7b73fcb4eb.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

勾选前两个分区

![65](https://upload-images.jianshu.io/upload_images/406169-64bcc00513c3fb6e.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如果发现分区信息不对，可以返回上一步，重新选择另一个PhysicalDrive，然后再试

点击 Power on this virtual machine 启动测试虚拟机

![66](https://upload-images.jianshu.io/upload_images/406169-e5d13b413792203b.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

启动之后

![67](https://upload-images.jianshu.io/upload_images/406169-9ffc9c3deb13026c.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这时候输入 用户名 `root` 和 passwd 设置的密码就可以登陆了

![68](https://upload-images.jianshu.io/upload_images/406169-49baa6022bb3363d.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如果有USB的无线网卡，挂到虚拟机里，输入 `wifi-menu` 就可以选择无线网络了

![69](https://upload-images.jianshu.io/upload_images/406169-6f763ef7d1e828ff.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `shutdown -h now` 关闭测试虚拟机

>如果没有，可以去任何支持BIOS(legacy)引导的实体机试试，开机的时候狂按F2键，进入BIOS修改启动项，将U盘设置为第一个，然后重启，应该就可以进入U盘中的系统了

>进入BIOS的功能不同的厂家生产的机器应该时不相同的，这个根据实际情况进项操作

如果关机之后，Windows 出现如下对话框，请点击 取消(Cancel)

![70](https://upload-images.jianshu.io/upload_images/406169-9b6fc4b05537c9e2.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### 配置UEFI引导

编辑 Installer 虚拟机，点击 Edit virtual machine settings

![71](https://upload-images.jianshu.io/upload_images/406169-251cd5db2dbe2d7a.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

在Options选项卡，Advanced选项右侧，将Firmware type 改为UEFI，**不要勾选 Enable Secure Boot**，然后保存

![72](https://upload-images.jianshu.io/upload_images/406169-3f07f37fb2131fc6.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

和前文一样

- 启动 Installer 虚拟机
- 输入 `mount /dev/sdb2 /mnt`，挂载根分区
- 输入 `mount /dev/sdb1 /mnt/boot/efi`，挂载EFI分区
- 输入 `arch-chroot /mnt` 进入新系统

输入 `grub-install --target=x86_64-efi --efi-directory=/boot/efi --removable` 安装UEFI启动项

![73](https://upload-images.jianshu.io/upload_images/406169-5eb80173a7252c60.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 测试UEFI引导

输入 `shutdown -h now` 关闭 Installer 虚拟机

和前文一样，修改 Boot 虚拟机的启动模式为 UEFI，**不要勾选 Enable Secure Boot**

启动 Boot 虚拟机，这时应该可以启动了，然后关闭 Boot 虚拟机

> 可以去支持UEFI启动的实体机上试试，不过一定要关闭Secure Boot

### Secure Boot

很遗憾，目前为止，我还没有找到解决 Secure Boot 的方法，所以只能先关闭Secure Boot 再启动U盘中的 Archlinux。

网上所有我见过的解决Secure Boot的方法，都无法解决U盘移动后，磁盘信息可能会发生变化的情况，而且一般情况下不同计算机中的磁盘信息显然都是不同的。

经测试，Secure boot 安装在硬盘中是可以使用的，具体参考 [安装ArchLinux到硬盘](./0cd4748b-b63c-4c7c-8fae-a862cbcc0698)

****

如果BIOS(legacy)和UEFI两种启动方式，都可以启动，那么说明Archlinux已经安装成功。这时 Installer 虚拟机就失去了它的作用，可以删除了。

## 实体机测试

普通PC可以在开机的时候狂按 F2 、F12、Enter 来调整启动的顺序，理论上就可以进入了。

MAC 机器在开机的时候，按住option键，出现启动选项之后，选择 EFI boot 就可以了。