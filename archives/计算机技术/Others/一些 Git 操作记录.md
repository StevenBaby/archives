# 一些 Git 操作记录

[annotation]: <id> (fadb1d61-b9d0-49ae-bbce-57bb68b524d9)
[annotation]: <status> (public)
[annotation]: <create_time> (2021-02-25 17:24:02)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Git)
[annotation]: <comments> (false)
[annotation]: <url> (http://blog.ccyg.studio/article/fadb1d61-b9d0-49ae-bbce-57bb68b524d9)


## git 撤销提交

撤回最近一次的commit(撤销commit，不撤销git add)

    git reset --soft HEAD~1 

撤回最近一次的commit(撤销commit，撤销git add)

    git reset --mixed HEAD~1 

撤回最近一次的commit(撤销commit，撤销git add,还原改动的代码)

    git reset --hard HEAD~1 

---

## git 不提交指定文件

执行命令将 `filename` 加入不提交队列

    git update-index --assume-unchanged filename

执行命令将 `filename` 取消加入不提交队列

    git update-index --no-assume-unchanged filename

---

## Linux samba 分享目录 Windows 数据不一致的问题

执行命令忽略文件模式和行结束符

```sh
git config --global core.filemode false
git config --global core.autocrlf true
```

## error: object file ... is empty

删除所有空白文件

```sh
cd .git
find . -type f -empty -delete -print
```

然后，打印出日志文件最后两行：

```sh
cd ..
tail -n 1 .git/logs/refs/heads/master
```

然后，查看版本是否正常，xxxx 是第二个哈希：

    git show xxxx

然后，归档：

    git update-ref HEAD xxxx

检查一下：

    git fsck

## 参考资料

- <https://www.liangjucai.com/article/83>
- <https://www.cnblogs.com/maycpou/p/11506844.html>