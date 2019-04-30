# Linux 常用命令和操作

[annotation]: <id> (121df3e0-6d5d-41ff-8f1b-0d44f3f5d00d)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Linux)
[annotation]: <create_time> (2010-04-04 18:03:07)

## 将vim置于后台

将当前的vim置于后台

    ctrl + z

查看有哪些vim在后台

    jobs

将当前的vim置于前台

    fg

## 查看进程所使用内存大小 <sub><small>[2018-07-27]</small></sub>

无意间发现了这个命令组合，异常强大，特意记录，以备后用

```sh
$ ps -eo size,pid,user,command --sort -size | awk '{ hr=$1/1024 ; printf("%13.2f Mb ",hr) } { for ( x=4 ; x<=NF ; x++ ) { printf("%s ",$x) } print "" }' |cut -d "" -f2 | cut -d "-" -f1
```

输出内容

```text
   1288.57 Mb /usr/lib/firefox
   821.68 Mb /usr/lib/chromium/chromium 
   762.82 Mb /usr/lib/chromium/chromium 
   588.36 Mb /usr/sbin/mysqld 
   547.55 Mb /usr/lib/chromium/chromium 
   523.92 Mb /usr/lib/tracker/tracker
   476.59 Mb /usr/lib/chromium/chromium 
   446.41 Mb /usr/bin/gnome
   421.62 Mb /usr/sbin/libvirtd
   ...
```

## extglob

如果 shpot 开启 extglob 选项, shell 将启用模式匹配

```shell
# 将目录下所有的文件和目录移动到 backup 目录中.
mv !(backup) backup/
```

```shell
# 删除不以 .log 结尾的文件
rm -rf !(*.log)
```

## 关闭selinux

### 临时关闭selinux

```sh
setenforce 0 ##设置SELinux 成为permissive模式
setenforce 1 ##设置SELinux 成为enforcing模式
```

### 永久关闭selinux

修改 `/etc/selinux/config` 文件

将 `SELINUX=enforcing` 改为 `SELINUX=disabled`
重启机器即可

## 参考资料

- [How to measure actual memory usage of an application or process?](https://stackoverflow.com/questions/131303/how-to-measure-actual-memory-usage-of-an-application-or-process)