# 安装 ArchLinux 到U盘（五）配置系统

[annotation]: <id> (973c0463-de5a-48d8-8463-ffde83dcb230)
[annotation]: <create_time> (2018-01-15 20:50:00)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (操作系统|Linux)
[annotation]: <status> (public)
[annotation]: <topics> (安装 ArchLinux 到U盘)
[annotation]: <comments> (true)

> 原文链接：<http://blog.ccyg.studio/article/973c0463-de5a-48d8-8463-ffde83dcb230>

---


## Windows Explorer 提示格式化

如前所述，Windows 会再插入U盘时，提示格式化，这时一定不能格式化

![1](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-1.png)

想要去掉U盘中EFI分区和根分区在 Explorer 中的显示，发现Windows磁盘管理是无法删除盘符的

![2](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-2.png)

这时点击 Windows + X，选择管理员启动 PowerShell

![3](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-3.png)

输入  `.\mountvol.exe X:\ /D` 其中X为具体盘符

![4](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-4.png)

这样，就不会再出现EFI分区和根分区的显示，也不会出现格式化对话框了。不过如果换了新的计算机，还是会显示，同样做上面的操作就不会显示了。

***

## 新建虚拟机

可以新建一个和 Boot 虚拟机一样的虚拟机，启动方式随意，最好是BIOS启动，这样在VMware中速度快一点，然后启动虚拟机，就可以操作U盘中的系统了。

***

## 新建用户

目前Archlinux只有root用户，可以新建一个用户，这样操作起来安全一点。

以root用户登陆，输入 `useradd -G root -m steven`，新建用户名为 steven，用户名可以自行修改，并且加入root用户组

![5](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-5.png)

输入 `passwd steven` 修改 steven 用户的密码

![6](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-6.png)

这样用户就新建完成了，可以试试输入 `exit` 退出登陆，然后以新用户登陆系统

![7](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-7.png)

***

## 配置sudo

一些操作需要使用root权限来操作，这时可以使用sudo来操作

以root用户登陆，输入 `chmod +w /etc/sudoers`，取消文件只读

![8](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-8.png)

修改文件 `/etc/sudoers`，在 `root ALL=(ALL) ALL` 下加入一行 `steven ALL=(ALL) ALL`，其中steven为你新建的用户名，然后保存

![9](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-9.png)

输入 `chmod -w /etc/sudoers`，文件只读

![10](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-10.png)

这时就可以使用 `sudo` 来获取root权限了

如果无法使用sudo，可以使用 `su` 命令，输入root密码，进入root账号

![11](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-11.png)

***

## 禁止bell警告音

root用户输入 `echo "blacklist pcspkr" > /etc/modprobe.d/nobeep.conf`

![12](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-12.png)

然后输入 `reboot`, 重新启动 Archlinux

***

## 配置网络

不难发现现在还无法联网，在虚拟机中可以启动 dhcp 服务器自动获取IP地址

![13](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-13.png)

输入 `ifconfig -a` 查看网卡名，可以看到这里是 **ens33**

![14](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-14.png)

输入 `systemctl start dhcpcd@ens33` 启动DHCP服务

![15](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-15.png)

输入 `ping www.baidu.com` 可以发现已经可以连接百度了

![16](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-16.png)

输入 `systemctl enable dhcpcd@ens33` 设置开机启动DHCP服务

![17](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-17.png)

这时，基本的配置已经完成，操作系统已经可以正常使用了，如果无法使用DHCP服务，可以参考WiKi来设置网络

[Network configuration](https://wiki.archlinux.org/index.php/Network_configuration)

[Network configuration (简体中文)](https://wiki.archlinux.org/index.php/Network_configuration_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))

***

## NetworkManager

强烈建议使用 NetworkManager 来管理网络

安装NetowrkManager

    pacman -S networkmanager

启动和自启动 NetworkManager
```
systemctl start NetworkManager
systemctl enable NetworkManager
```

---

## 配置SSH

输入 `pacman -S openssh` 安装 openssh

![18](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-18.png)

输入 `systemctl start sshd` 启动ssh服务

![19](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-19.png)

输入 `systemctl enable sshd` 设置开机启动ssh服务

![20](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%BA%94%EF%BC%89%E9%85%8D%E7%BD%AE%E7%B3%BB%E7%BB%9F-20.png)

这时就可以使用ssh客户端来登陆Archlinux了，建议使用 Xshell 来登陆

以后所有演示，将会在Xshell中进行
***

## 以太网支持

安装 **ifplugd** 会在自动配置以太网
```
pacman -S ifplugd
```
***

## 无线网支持

安装下面的包，可以获得基础命令行 WiFi 支持

```
pacman -S iw wpa_supplicant dialog
```
***

## 显卡驱动

安装下面的包，可以解决大部分的显卡驱动
```
pacman -S xf86-video-ati xf86-video-intel xf86-video-nouveau xf86-video-vesa
```
***

## 触摸板驱动

安装下面的包，可以解决标准笔记本触摸板驱动
```
pacman -S xf86-input-synaptics
```
***

## 电池支持

安装下面的包，可以解决电池状态的获取

```
pacman -S acpi 
```
***
