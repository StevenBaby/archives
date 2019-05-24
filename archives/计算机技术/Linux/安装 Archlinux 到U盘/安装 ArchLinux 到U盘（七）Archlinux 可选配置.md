# 安装 ArchLinux 到U盘（七）Archlinux 可选配置

[annotation]: <id> (5c3a4435-dec5-4a15-b30c-3dea4ae35e40)
[annotation]: <create_time> (2018-01-15 23:06:00)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (操作系统|Linux)
[annotation]: <status> (public)
[annotation]: <topic> (安装 ArchLinux 到U盘)
[annotation]: <index> (7)
[annotation]: <comments> (true)

> 原文链接：<http://blog.ccyg.studio/article/5c3a4435-dec5-4a15-b30c-3dea4ae35e40>

---

![1](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%B8%83%EF%BC%89Archlinux%20%E5%8F%AF%E9%80%89%E9%85%8D%E7%BD%AE-1.png)

## ibus输入法只能双拼
如果ibus 输入法只能双拼的话 ，在终端输入 `ibus-daemon -drx` 重启即可

---

## 无法sudo
如果不能sudo，显示错误 is not in the sudoers file.  This incident will be reported.
以root权限编辑 `/etc/sudoers` 文件，在 `root ALL=(ALL) ALL` 下面 加上 `username ALL=(ALL) ALL`，保存即可，（其中username 为你自己的用户名）

---

## 显示隐藏文件夹
要显示隐藏文件夹按 `CTRL+H`

---

## gnome 的一些程序名称

可用于配置全局快捷键

名称|用途
-|-
gnome-terminal | terminal 终端
nautilus | 文件管理器，类似于Windows的Explorer

---

## 启用 Intel 微指令更新

处理器厂商会发布 [microcode](https://en.wikipedia.org/wiki/Microcode "wikipedia:Microcode") 以增强系统稳定性和解决安全问题。Microcode 可以通过 BIOS 更新，Linux 内核也支持启动时应用新的 Microcode。没有这些更新，可能会遇到一些很难查的的死机或崩溃问题。

```shell
$ pacman -S intel-ucode
grub-mkconfig -o /boot/grub/grub.cfg
```

---

## Windows 想要访问 Linux 文件

参阅 [samba 配置](./57368d24-03c1-4738-aaac-09d14bcf5314)

---

## 安装网易云音乐

编辑 pacman 配置文件 **/etc/pacman.conf**

在文件最后加入

```
[archlinuxcn]
Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch
```
- 执行 `pacman -Syu` 同步系统
- 执行 `pacman -S netease-cloud-music` 安装网易云音乐

---

## 安装 AUR 包

- 下载包快照 (snapshots)
- 解压包到任意目录
- 执行 `makepkg -si`  安装包

---

## 禁止 anjuta 改用 nautilus 默认打开目录

编辑文件 **~/.local/share/applications/mimeapps.list**
添加或者替换 ` inode/directory`
```
inode/directory=org.gnome.Nautilus.desktop
```

---

## 添加目录到 nautilus 侧边栏
进入想要添加的目录，点击nautilus右上角小按钮，添加书签

---

## 解析局域网主机名

```
pacman -S avahi
```

编辑文件 **/etc/nsswitch.conf**，在hosts: 一行最后加上 mdns

```
systemctl start avahi-daemon
systemctl enable avahi-daemon
```

然后就可以 **ping hostname.local**
**注意：一定要在主机名后面加上 .local**

**这部分类容可能有问题，经测试无法复现**

---

## 个性化 grub 启动界面
默认的grub启动界面异常的丑陋，如下图所示
![2](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%B8%83%EF%BC%89Archlinux%20%E5%8F%AF%E9%80%89%E9%85%8D%E7%BD%AE-2.png)

想要修改grub的默认启动界面，可以在下面的链接中寻找自己喜欢的主题，来配置grub的启动界面，使其变得好看，这部分属于强迫症选项，并不会对系统带来实质性的变化，仅仅就是为了好看。

<https://addons.videolan.org/browse/cat/109/ord/top>

下面以 **Breeze GRUB2 theme** 为例，来配置grub启动界面

进入 <https://addons.videolan.org/p/1000140/>，点击右侧 download 下载 **Breeze-GRUB2.tar.gz**

解压文件，将 **breeze** 目录复制到 /boot/grub/themes

编辑文件 **/etc/default/grub** 加入下面一行
```
GRUB_THEME=/boot/grub/themes/breeze/theme.txt
```

执行命令 
```shell
# grub-mkconfig -o /boot/grub/grub.cfg
```
重启就可以了

![3](http://pqs8hg59d.bkt.clouddn.com/%E5%AE%89%E8%A3%85%20ArchLinux%20%E5%88%B0U%E7%9B%98%EF%BC%88%E4%B8%83%EF%BC%89Archlinux%20%E5%8F%AF%E9%80%89%E9%85%8D%E7%BD%AE-3.png)

----

## grub 直接启动默认系统
修改文件 **/etc/default/grub**，设置如下属性
```
GRUB_TIMEOUT=0
```

执行命令 
```shell
# grub-mkconfig -o /boot/grub/grub.cfg
```
重启就可以了

----

## 配置http代理

```shell
export http_proxy=http://example.com:8080
export https_proxy=https://example.com:8080
```

例如 
```shell
export http_proxy=http://192.169.2.201:1080
export https_proxy=https://192.169.2.201:1080
```

也可以将其写入 ~/.bashrc 或者 ~/.bash_profile 中

## 禁止ssh root 登陆

修改 `/etc/ssh/sshd_config`

把 **PermitRootLogin yes** 改为 **PermitRootLogin no**
