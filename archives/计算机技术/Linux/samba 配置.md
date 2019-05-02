# samba 配置

[annotation]: <id> (57368d24-03c1-4738-aaac-09d14bcf5314)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Linux)
[annotation]: <status> (public)
[annotation]: <create_time> (2018-03-11 16:00:42)
[annotation]: <comments> (true)

## 安装 samba

```sh
pacman -S samba
```

## 配置文件位置

```
/etc/samba/smb.conf
```

## 共享 /tmp 目录
修改配置文件 `/etc/samba/smb.conf` 其中 username 是你自己的用户名
```
[global]

    workgroup = WORKGROUP
    server string = Samba Server
    log file = /var/log/samba/%m.log
    max log size = 50
    security = user
    unix extensions = no  
    follow symlinks = Yes
    wide links = Yes

[tmp]

    path = /tmp
    public = yes
    writable = yes
    printable = no
    create mask = 0765 
    browseable = yes
    available = yes
    valid users = username
```

## 添加用户
其中 username 为你自己的用户名

```sh
smbpasswd -a username
```

## 验证配置

```sh
testparm -s
```

输出结果

```
Load smb config files from /etc/samba/smb.conf
rlimit_max: increasing rlimit_max (1024) to minimum Windows limit (16384)
Processing section "[tmp]"
Loaded services file OK.
Server role: ROLE_STANDALONE
```

## 启动samba服务

```sh
sudo systemctl start smb nmb
```

## 重启samba服务

```sh
sudo systemctl restart smb nmb
```

## 设置开机启动

```sh
sudo systemctl enable smb nmb
```

## Windows 直接访问

在Explorer地址栏中输入 ``//192.168.xxx.xxx``，其中 `192.168.xxx.xxx` 为 Linux IP地址，可以使用 `ifconfig` 命令查看

![samba 配置-1.png](http://pqs8hg59d.bkt.clouddn.com/samba%20%E9%85%8D%E7%BD%AE-1.png)

输入用户名和密码之后，就可以看到 /tmp 目录了

![samba 配置-2.png](http://pqs8hg59d.bkt.clouddn.com/samba%20%E9%85%8D%E7%BD%AE-2.png)

## Windows 映射网络磁盘

直接访问的方式有一种缺陷，就是无法在 cmd 命令行窗口中访问，这时可以将某个共享目录映射出网络磁盘。
在计算机中 计算机选项卡下，点击 **Map network drive**

![samba 配置-3.png](http://pqs8hg59d.bkt.clouddn.com/samba%20%E9%85%8D%E7%BD%AE-3.png)

输入目录地址，点击完成就可以了，如果想要一直显示该目录，可以勾选 **Reconnect at sign-in**

![samba 配置-4.png](http://pqs8hg59d.bkt.clouddn.com/samba%20%E9%85%8D%E7%BD%AE-4.png)

然后计算机中就多出了一个网络磁盘

![samba 配置-5.png](http://pqs8hg59d.bkt.clouddn.com/samba%20%E9%85%8D%E7%BD%AE-5.png)

这时就可以在cmd控制台中正常访问了，如果不想用了，可以点击右键 > Disconnect


## 访问软连接
在 [global] 最后加入下面几行
```
unix extensions = no  
follow symlinks = Yes
wide links = Yes
```

## Windows 相关配置

### 应用程序无法打开共享文件

打开注册表，定位到下面

>HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System

新建DWORD值，命名为 **EnableLinkedConnections**，赋值为 **1**，然后重新启动操作系统


### 禁止网络磁盘故障提醒

修改注册表

>HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\NetworkProvider

创建DWORD  **RestoreConnection** = 0

修改注册表

>HKEY_CURRENT_USER\Network

创建DWORD  **RestoreDiskChecked** = 0