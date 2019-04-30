# Windows 10 配置

[annotation]: <id> (009f0e39-37f5-4932-bde8-1ad01483df64)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Windows)
[annotation]: <status> (public)
[annotation]: <create_time> (2018-01-11 17:52:07)
[annotation]: <comments> (true)

> 原文链接：<http://blog.ccyg.studio/article/009f0e39-37f5-4932-bde8-1ad01483df64>

---

## 去除计算机文件夹

打开注册表编辑器删除下面的所有值，除了 DelegateFolders

```reg
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\MyComputer\NameSpace
```

----

## 去除Explorer侧边栏U盘

打开注册表编辑器定位到下面

```reg
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Desktop\NameSpace\DelegateFolders\
```

将下面的 **{F5FB2C77-0E2F-4A16-A381-3E560C68BC83}** 重命名为 **-{F5FB2C77-0E2F-4A16-A381-3E560C68BC83}**，也就是在前面加上一个 **-**， U盘就消失了，想要的话还可以改回来

----

## 去除不想看见的分区
可以直接使用Windows磁盘管理删除磁盘字母，如果无法删除，可以使用下面的命令

```
mountvol X:\ /D
```

其中X为具体分区符号

----

## 应用程序无法打开共享文件夹
打开注册表，定位到下面

```reg
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System
```

新建DWORD值，命名为 **EnableLinkedConnections**，赋值为 **1**，然后重新启动操作系统

----

## Windows 10开始菜单无法编辑

打开注册表，删除下面的键，重新登陆就可以了

```reg
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\CloudStore\Store\Cache\DefaultAccount
```

----

## 去除有道词典底部广告

找到安装路径下

```
resultui\index.css
```

搜索 .footer .banner .container{display:inline-block;  将 inline-block 改成 none ，然后保存文件，重启软件即可。

----

## Potplayer Windows10皮肤

<https://github.com/stevenkangwei/blogfile/tree/master/software/potplayer%20skins>


## Potplayer 语言问题

如果所有关联的文字显示为中文，可以调整语言为英文之后，重新关联文件。取消关联然后重新关联。

----

## 清除运行历史

编辑注册表，根据需要删除该键下面的值

```reg
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\RunMRU
```

----

## 清除网络磁盘映射历史

编辑注册表，根据需要删除该键下面的值

```reg
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Map Network Drive MRU
```

----

## 清除Explorer地址输入历史

编辑注册表，根据需要删除该键下面的值

```reg
Computer\HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\TypedPaths
```

----

## 关闭Firefox截图功能

地址栏输入 `about:config` 进入Firefox配置

将 `extensions.screenshots.disabled` 改成 true

----

## Windows 自启动注册表位置

```reg
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
```

----

## 登陆执行命令

以开机启动虚拟机为例，运行 **gpedit.msc**，左侧找到 Scripts

![](http://pqs8hg59d.bkt.clouddn.com/Windows%2010%20%E9%85%8D%E7%BD%AE%20-1.png)

双击右侧 **logon**

![](http://pqs8hg59d.bkt.clouddn.com/Windows%2010%20%E9%85%8D%E7%BD%AE%20-2.png)

点击 **Add**

![](http://pqs8hg59d.bkt.clouddn.com/Windows%2010%20%E9%85%8D%E7%BD%AE%20-3.png)

输入命令，上面为程序位置，下面为参数，保存即可。

```bat
[location to vmware]\vmrun.exe
```

```bat
-T ws start "D:\Virtual Machines\Archlinux\Archlinux.vmx" nogui
```


![](http://pqs8hg59d.bkt.clouddn.com/Windows%2010%20%E9%85%8D%E7%BD%AE%20-4.png)

----

## 修改IE右键菜单

进入注册表编辑器下面得位置，选择性得删除扩展菜单

```reg
HKEY_CURRENT_USER\Software\Microsoft\Internet Explorer\MenuExt
```

----

##高分屏缩放跟随系统

参见 [Adobe 系列软件配置](https://www.jianshu.com/p/dbba0fd9448f)

**配置方式适用于任何软件，并不仅仅局限于Adobe软件，只是Photoshop首先出现了这个问题而已。**

----

## 禁止网络磁盘故障提醒

修改注册表

```reg
HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\NetworkProvider
```

创建DWORD  **RestoreConnection** = 0

修改注册表

```reg
HKEY_CURRENT_USER\Network
```

创建DWORD  **RestoreDiskChecked** = 0

---

## 去掉Python 右键 **Edit With IDLE**

修改注册表

```reg
HKEY_CLASSES_ROOT\Python.File\Shell
```

自行删除下面的Key

---

## 去掉右键 **Open in Visual Studio**

删除以下两个注册表项：
```reg
HKEY_CLASSES_ROOT\Directory\Background\shell\AnyCode
HKEY_CLASSES_ROOT\Directory\shell\AnyCode
```

---

## 配置多机器鼠标键盘共享

今天我遇到了一个新的问题，具体的表现是：我有了一个新的笔记本，之前有一个Surface，两台笔记本同时工作的话，就需要有两套键盘和鼠标，这就造成了一个很严重的问题，桌子上摆不开，而且操作也不够方便，这就让我有了用一套键盘和鼠标操作两台电脑的想法了，根据这个需求就上网查资料，找到了Synergy，经过简单的安装配置，终于可以共享鼠标和键盘了。


![](http://pqs8hg59d.bkt.clouddn.com/Windows%2010%20%E9%85%8D%E7%BD%AE%20-5.jpg)

附上下载地址 <https://www.brahma.world/synergy-stable-builds/>

7B76313B70726F3B53746576656E3B313B3B3B303B307D

---

## 出现文件 C:\AppData\Roaming\miniconfig\history.ini

- 终结正在运行的 FlashHelperService.exe 服务
- 重命名FlashHelperService.exe为任意名
- 新建记事本改名为 FlashHelperService.exe，设置为只读

---

## Windows 10 锁频壁纸位置

```reg
C:\Users\username\AppData\Local\Packages\Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy\LocalState\Assets
```
---

## 去掉 右键 Windows Defender 扫描

```reg
regsvr32 /i "C:\Program Files\Windows Defender\shellext.dll"

regsvr32 /u "C:\Program Files\Windows Defender\shellext.dll"
```
---

## chrome 离线安装包

<https://www.google.com/chrome/?standalone=1>

---

## 修改python字符编码为 UTF-8

添加环境变量 

```python
PYTHONIOENCODING = utf8
```
---

## 修改 cmd.exe 的字符编码为 UTF-8

编辑注册表 

```reg
HKEY_CURRENT_USER\Console\%SystemRoot%_system32_cmd.exe
```

添加值 `CodePage = fde9`  类型为 `DWORD` > `hexadecimal`

如果需要临时修改 cmd 的字符编码，则可以执行，转换为 UTF-8

```cmd
chcp 65001 
```

如果需要临时修改 cmd 的字符编码，则可以执行，转换为 GBK

```cmd
chcp 936 
```
---

## 修改任务栏时间显示秒

编辑注册表

```reg
HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced
```

新建一个 `DWORD` 32 位值，再将该值命名为 `ShowSecondsInSystemClock` = 1

重启 Windows 资源管理器就可以了

> 怎么重启 Windows 资源管理器？
>
> 随便打开一个文件夹
> 按住键盘 `CTRL` + `SHIFT` + `ESC`，就会弹出任务管理器
> 在应用里找到 Windows Explorer
> 然后 点击鼠标右键 -> 重新启动

![1556250555(1).jpg](http://pqs8hg59d.bkt.clouddn.com/Windows%2010%20%E9%85%8D%E7%BD%AE%20-6.png)

---
