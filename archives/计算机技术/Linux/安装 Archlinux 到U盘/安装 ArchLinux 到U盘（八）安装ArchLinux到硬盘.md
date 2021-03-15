# 安装 ArchLinux 到U盘（八）安装ArchLinux到硬盘

[annotation]: <id> (0cd4748b-b63c-4c7c-8fae-a862cbcc0698)
[annotation]: <create_time> (2018-02-04 21:05:00)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (操作系统|Linux)
[annotation]: <status> (public)
[annotation]: <topic> (安装 ArchLinux 到U盘)
[annotation]: <index> (8)
[annotation]: <comments> (true)


![1](images/install_archlinux_to_usb_7_1.png)

前面写了如何将ArchLinux安装到U盘的全过程，有一个缺陷就是SecureBoot无法解决。如果将系统装入硬盘那么就可以解决这一问题，只不过不能像U盘一样随意移动。

本来这篇文章我打算写到 [Archlinux 可选配置](../5c3a4435-dec5-4a15-b30c-3dea4ae35e40) 中，但是仔细想想这个也算是比较大的一个事情吧，所以另写一篇文章。

现在的问题是这样的：
1.  U盘系统虽然易携带、操作方便，但是不可避免的占用了一个USB接口，如果计算机USB接口不够多的话反而会很麻烦。

2.  需要长期运行ArchLinux，而且U盘的读写速度比较慢。

为了解决这个问题，可以将系统装入硬盘，硬盘的读写速度显然要比U盘快得多，如果是SSD的话，读写速度就更快了。

装入硬盘之后可以达到以下两种启动方式：

1. 系统直接从物理机启动
2. Windows启动后，运行再VMWare虚拟机中

这两种启动方式都不可或缺，首先Windows的用户体验显然要比Gnome好得多，其次，在中国基于Windows得软件几乎是不可或缺。所以一般情况下应该是使用第二种方式。好处就是，第一种方式可以启动以备不时之需，最最重要得是，这两种方式使用同一个分区，数据相同。

由于前面得一系列文章，默认现在已经有了可以从U盘启动的Archlinux。

- 安装之前自行找一个硬盘分区，用于安装系统。

-  执行下面的命令，安装 Archlinux 维护工具包

```
pacman -S arch-install-scripts
pacman -S devtools
```

- 格式化分区为 ext4 格式，其中xxx是分区名称，**注意一定要写对，如有数据遗失，概不负责**
```
mkfs.ext4 /dev/xxx
```
- mount 分区到 /mnt
```
mount /dev/xxx /mnt
```
- 安装 Archlinux，参考 [安装Archlinux](../4f6cfa0a-ad98-4adb-af08-79a8a5b1d674) 从 **选择镜像** 开始

正常情况下系统就可以启动了，下面配置从VMWare 启动

- 新建虚拟机
- 硬盘选择物理磁盘，勾选安装Archlinux的分区（注意选择和物理磁盘一样接口）
- 新建虚拟磁盘，大小随意，可以写小数。比如 0.1G
- arch-choot 到系统，安装grub引导就可以了。

>grub-install --target=x86_64-efi --efi-directory=/boot/efi  --bootloader-id=grub


## 防止VMWare 自动挂起

Windows 关机的时候，默认情况下VMware会挂起虚拟机，如果直接从物理机启动系统，这样可能会造成虚拟机恢复后的数据不一致，所以需要在Windows关闭时也同时关闭虚拟机而不是挂起虚拟机。具体操作如下。

修改.vmx文件最后加入

    vmx.headless.suspendOnHostShutdown = "FALSE"

## Secureboot
之前U盘中的系统是无法解决Secureboot，但是硬盘中的系统是可以解决的。参考 [Secureboot](https://wiki.archlinux.org/index.php/Secure_Boot)

下载如下两个文件：

-  [PreLoader.efi](https://blog.hansenpartnership.com/wp-uploads/2013/PreLoader.efi) 
- [HashTool.efi](https://blog.hansenpartnership.com/wp-uploads/2013/HashTool.efi "LCA2013 and Rearchitecting Secure Boot")

保存至 **/boot/EFI/grub**

执行如下命令

>efibootmgr --disk /dev/sdX --part Y --create --label "Archlinux" --loader /EFI/grub/PreLoader.efi

其中X为EFI分区所在的磁盘, Y为EFI分区的编号。其中 Archlinux 可以任意修改。

拷贝grub启动项到loader.efi

>cp /boot/EFI/grub/grubx64.efi /boot/EFI/grub/loader.efi

重启打开Secure Boot功能，首次使用，PreLoader加载loader.efi时会发现hash认证失败，因为我们没有把它的hash加入白名单，于是它会提示启动Hashtool.efi（就是蓝色的只有一个OK选项的界面。），选择OK，选择Enroll Hash，再选择loader.efi，最后选择yes，此时应该就能进grub了。