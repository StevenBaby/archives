# Windows chkdsk 磁盘修复工具

[annotation]: <id> (09d7bd9a-6b32-4f81-a93e-e746453c7ffc)
[annotation]: <status> (public)
[annotation]: <create_time> (2019-04-30 18:26:07)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Windows)
[annotation]: <comments> (true)

> 原文链接：<http://blog.ccyg.studio/article/09d7bd9a-6b32-4f81-a93e-e746453c7ffc>

---

前两天，接到朋友的消息，说电脑坏了，让我帮他修一下。说具体的现象是，开机就蓝屏。应该是他自己强制关机造成的，遂去修电脑。

我很自然地想到了可能是引导坏了，修复一下引导应该就可以了，于是插入已经装了PE的U盘，开机，进入BIOS，设置U盘启动。通过一番折腾，发现U盘启动不了，我开始怀疑是不是我自己的U盘坏了，再经过一番折腾，发现我插得那个USB口是坏的，换了一个USB口之后，很顺利的就进去了。

进去之后发现C盘，的容量整个变成了0，所以怀疑应该是分区坏了，打开分区工具，发现C盘里的内容还能读取，所以应该不是磁盘坏了。用磁盘工具检测磁盘坏道也是什么都没有。于是开始焦绿。这玩意儿之前还真没见过。

![Windows chkdsk 磁盘修复工具-1.png](images/feel-banana-green.png)

然后便想到应该是磁盘什么地方出问题了，导致Windows不能读取，于是想到了磁盘修复工具，也就是 `chkdsk` 这个工具了。

于是 `WIN` + `R`，敲入 `cmd` 打开控制台窗口，执行命令：

```cmd
chkdsk /?
```

输出：

```text
Checks a disk and displays a status report.


CHKDSK [volume[[path]filename]]] [/F] [/V] [/R] [/X] [/I] [/C] [/L[:size]] [/B] [/scan] [/spotfix]


  volume              Specifies the drive letter (followed by a colon),
                      mount point, or volume name.
  filename            FAT/FAT32 only: Specifies the files to check for
                      fragmentation.
  /F                  Fixes errors on the disk.
  /V                  On FAT/FAT32: Displays the full path and name of every
                      file on the disk.
                      On NTFS: Displays cleanup messages if any.
  /R                  Locates bad sectors and recovers readable information
                      (implies /F, when /scan not specified).
  /L:size             NTFS only:  Changes the log file size to the specified
                      number of kilobytes.  If size is not specified, displays
                      current size.
  /X                  Forces the volume to dismount first if necessary.
                      All opened handles to the volume would then be invalid
                      (implies /F).
  /I                  NTFS only: Performs a less vigorous check of index
                      entries.
  /C                  NTFS only: Skips checking of cycles within the folder
                      structure.
  /B                  NTFS only: Re-evaluates bad clusters on the volume
                      (implies /R)
  /scan               NTFS only: Runs an online scan on the volume
  /forceofflinefix    NTFS only: (Must be used with "/scan")
                      Bypass all online repair; all defects found
                      are queued for offline repair (i.e. "chkdsk /spotfix").
  /perf               NTFS only: (Must be used with "/scan")
                      Uses more system resources to complete a scan as fast as
                      possible. This may have a negative performance impact on
                      other tasks running on the system.
  /spotfix            NTFS only: Runs spot fixing on the volume
  /sdcleanup          NTFS only: Garbage collect unneeded security descriptor
                      data (implies /F).
  /offlinescanandfix  Runs an offline scan and fix on the volume.
  /freeorphanedchains FAT/FAT32/exFAT only: Frees any orphaned cluster chains
                      instead of recovering their contents.
  /markclean          FAT/FAT32/exFAT only: Marks the volume clean if no
                      corruption was detected, even if /F was not specified.

The /I or /C switch reduces the amount of time required to run Chkdsk by
skipping certain checks of the volume.
```

然后看到 `/F` 参数是用来 解决磁盘错误的，于是执行：

```cmd
 chkdsk C: /F
```

经过一段时间的等待，修复完成之后，C盘便能读取了，C盘能读取之后系统便修复完成了。然后重启电脑，发现需要扫描磁盘，这个应该是Windows系统建立的索引坏了，要重新建立，可以跳过，不过最好还是等待扫描完成，否则下一次启动的时候还是会扫描。

