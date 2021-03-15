# VMWare 自动适配 Archlinux 图形界面

[annotation]: <id> (4a73a69f-2aaf-4c50-89a8-0bdd0149f7d8)
[annotation]: <status> (public)
[annotation]: <create_time> (2021-03-15 13:46:16)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (VMWare|Archlinux|Linux)
[annotation]: <comments> (true)
[annotation]: <url> (http://blog.ccyg.studio/article/4a73a69f-2aaf-4c50-89a8-0bdd0149f7d8)

## 检查 VMWare 设置

确保选中 `View` --> `Autosize` --> `Autofit Guest`

## 安装必要工具包

```
pacman -S gtkmm
pacman -S gtkmm3
pacman -S gtk2
pacman -S open-vm-tools
pacman -S xf86-input-vmmouse
pacman -S xf86-video-vmware
```

## 自启动 `vmtoolsd` 服务

    systemctl enable vmtoolsd

## 添加相关模块

修改文件 `/etc/mkinitcpio.conf`，添加内容

    MODULES=(vsock vmw_vsock_vmci_transport vmw_balloon vmw_vmci vmwgfx)

重新生成初始化环境

    mkinitcpio -p linux

## 重启虚拟机

    reboot

## 参考资料

- <https://wiki.archlinux.org/index.php/VMware/Install_Arch_Linux_as_a_guest#Window_resolution_autofit_problems>