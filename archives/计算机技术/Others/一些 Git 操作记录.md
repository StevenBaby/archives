# 一些 Git 操作记录

[annotation]: <id> (fadb1d61-b9d0-49ae-bbce-57bb68b524d9)
[annotation]: <status> (public)
[annotation]: <create_time> (2021-02-25 17:24:02)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Git)
[annotation]: <comments> (false)
[annotation]: <url> (http://blog.ccyg.studio/article/fadb1d61-b9d0-49ae-bbce-57bb68b524d9)

## git 不提交指定文件

执行命令将 `filename` 加入不提交队列

    git update-index --assume-unchanged filename

执行命令将 `filename` p取消加入不提交队列

    git update-index --no-assume-unchanged filename

---

## 参考资料

- <https://www.liangjucai.com/article/83>