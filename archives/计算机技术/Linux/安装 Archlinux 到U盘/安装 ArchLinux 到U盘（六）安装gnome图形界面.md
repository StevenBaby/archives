# 安装 ArchLinux 到U盘（六）安装gnome图形界面

[annotation]: <id> (255f0ebd-a9af-40a2-ba94-d45e10baeff1)
[annotation]: <create_time> (2018-01-15 21:49:00)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (操作系统|Linux)
[annotation]: <status> (public)

## 安装 gnome

输入 `pacman -Syu` 更新系统

![01.jpg](http://upload-images.jianshu.io/upload_images/406169-d882a4e0b0546071.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

输入 `pacman -S gnome gnome-extra` 安装 gnome，出现选项之后点击 `Enter`，时间较长，请耐心等待

输入 `pacman -S xorg xorg-xinit` 安装驱动

编辑文件 `~/.xinitrc` 输入 `exec gnome-session` 保存

然后在虚拟机中输入 `startx`，稍等片刻，就可以启动 gnome 图形界面了

![02.jpg](http://upload-images.jianshu.io/upload_images/406169-449e2fde75259e78.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如果等待好久，还是无法启动，请关闭虚拟机，把虚拟机内存调大再试

![03.jpg](http://upload-images.jianshu.io/upload_images/406169-486b9e77a971daed.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


注销之后，就又回到了tty命令行

***

## 配置 gnome 网络

强烈建议开启 **NetworkManager** 这样可以在图形界面中设置网络

输入 `systemctl disable dhcpcd@ens33` 禁用DHCP服务

输入 `systemctl start NetworkManager` 启动网络管理工具

输入 `systemctl enable NetworkManager` 设为开机启动

***

## 安装可选软件

利用pacman –S 来安装软件，想必你对pacman的用法已经很熟悉了，这里就不一一写了。下表列出了pacman的软件名称及说明

名称|功能
-|-
ntfs-3g | 支持NTFS文件系统的读写
wqy-zenhei | 字体，用来支持中文
ibus ibus-pinyin | ibus 拼音输入法
firefox | 火狐浏览器
chromium | chromium浏览器
net-tools | 一些网络工具，如ifconfig等
gnome-tweak-tool | gnome 配置工具
libreoffice | 办公软件
rhythmbox | 音乐播放器
flashplugin | flash 插件
vlc | vlc 视频播放器
gnome-packagekit | 包管理工具
ttf-fireflysung | 解决flash乱码

## 默认启动 gnome

如果想要默认启动 gnome 而不是使用 `startx` 的方式，输入 `systemctl enable gdm` 即可

***

到这里，系统安装就已经完成了，如果系统使用过程中有不舒心的地方，可以查看 [Archlinux 可选配置](./5c3a4435-dec5-4a15-b30c-3dea4ae35e40)，来优化系统，祝君好运！！！