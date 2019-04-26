# 安装 ArchLinux 到U盘（一）准备工作

[annotation]: <id> (55ffae4e-64e2-4b8e-bb9d-3ae759b3e223)
[annotation]: <create_time> (2018-01-14 17:06:00)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (操作系统|Linux)
[annotation]: <status> (public)
[annotation]: <comments> (true)

> 原文链接：<http://blog.ccyg.studio/article/55ffae4e-64e2-4b8e-bb9d-3ae759b3e223>

---


## 关于这篇文章

我在学生时代，学校机房的机器是不存储数据的，具体表现是，过一段时间机房的数据就会还原，类似于网吧。

这就发生了一些问题，具体就是有一些数据我们并不想让它删除，所以就需要一种便携式的操作系统，最好是能装在U盘里，随身携带，只要有机器就能启动，就能使用，并且拥有所有的功能，只要硬件支持。

老师介绍了两种Linux系统，**Archlinux** 和 **SUSE Linux**，我经过调研选择了Archlinux，然后经过实践，发现上面的功能是可以实现的。后来我写了一篇文章，记录了整个安装过程，当时是2014年5月。但是在最近（2018-01）我发现了随着时间的推移，已经过去了三年多，计算机的发展导致了之前的一些功能无法使用，最具体的一个表现就是UEFI启动，应该是自从Windows 8.1 开始所有新出场的计算机都该用了UEFI启动，替换了之前的BIOS启动，这导致了之前使用BIOS启动方式的失效。所以这重新再写一下这个文章，并且在以后的岁月里，不断地更新。

不过目前还是有一些小问题，不过瑕不掩瑜，对于系统的使用没有影响，而且这些问题会在以后慢慢解决。

附上之前写的教程，在百度文库 [在U盘安装ArchLinux操作系统](https://wenku.baidu.com/view/f40d8c207fd5360cba1adbfb.html)

## Archlinux 介绍

Arch Linux是起源于加拿大的一份致力于使用简单、系统轻量、软件更新速度快的GNU/Linux发行版。

也就是说它足够的轻量级，以至于装到U盘中都几乎不会卡顿。

至于更加具体的Archlinux介绍，还请移步 [Arch WiKi](https://wiki.archlinux.org/index.php/Arch_Linux)

## U盘

工欲善其事必先利其器，要想在U盘安装Linux就必须有一个容量足够大，而且读写速度不慢的U盘。一般建议16GB为好，这里使用32GB的U盘作为演示，具体根据需求自行准备。

**安装过程会格式化U盘，如有资料请备份**

附上我使用的U盘，并非做广告，只是为了有一张图，标题会好看一点而已。

![SanDisk](https://upload-images.jianshu.io/upload_images/406169-39d2550bfab94541.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 下载Archlinux镜像

如果看过网上的一些安装Archlinux 的教程，之前的Archlinux的版本都有/arch/setup 这个脚本来安装，他是一种Dialog的图形化安装脚本。不过最新的Archlinux去掉了脚本，变成的全手动的安装方式。这里选择手动的安装方式，如果想要体验图形化的脚本安装可以下载之前的.iso 文件来安装Archlinux。这里附上Archlinux最新的安装镜像下载地址：

<https://www.archlinux.org/download/>

还有最新的Torrent 地址 （2018-01-01）

<https://www.archlinux.org/releng/releases/2018.01.01/torrent/>

## 下载VMware

如果有安装系统经验，那么肯定会想到将镜像文件刻光盘，或者做一个U盘镜像用U盘来安装系统。当然可以那么做，但是那样会白白浪费一张光盘，或者是还得准备一个U盘，就不划算了。这里选择在虚拟机中安装系统的方式。除去了格盘选择错误的风险。如果想要从光盘或者U盘安装，可以自行百度。至于下载VMware：

1. 可以去 [VMware官网](https://www.vmware.com)，不过这种方式略显麻烦

2. ~~可以去 [百度软件中心](http://rj.baidu.com/soft/detail/13808.html) ，点击普通下载即可下载~~

3. ~~附上百度软件中心 [最新下载链接 14.0.0.24051](http://sw.bos.baidu.com/sw-search-sp/software/ca7ad8c6d3103/VMware-workstation-full-14.0.0.24051.exe)~~  百度软件中心已经下线 <sub>2019-04-26 更新</sub>

