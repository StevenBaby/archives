# python 基础配置

[annotation]: <id> (8ced6520-d3b5-46b4-8823-14c5bf702ed2)
[annotation]: <status> (public)
[annotation]: <create_time> (2019-04-30 18:20:47)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Python)
[annotation]: <comments> (true)




## 在 CentOS 上安装 Python 3.6

需要执行一下命令

```shell
# yum install epel-release 
```

```shell
# yum install python36
```

## 配置pypi用户名密码 ##

修改配置文件  **~/.pypirc**

    [distutils]
    index-servers = pypi

    [pypi]
    username:username of yours
    password:password of yours

## pypi 打包上传命令

    python setup.py sdist bdist_wheel –universal
    python setup.py sdist bdist_wheel upload

## 修改 pip 源 ##

可以在 pip install 的时候直接加上

    pip install xxx -i https://pypi.tuna.tsinghua.edu.cn/simple

或者 打开文件 **~/.pip/pip.conf**，写入下面的内容


    [global]
    index-url = https://pypi.tuna.tsinghua.edu.cn/simple

一些源地址：

- 官方 <https://pypi.org/simple/>
- 清华大学 <https://pypi.tuna.tsinghua.edu.cn/simple>
- 豆瓣 <https://pypi.douban.com/simple/>


## 设置环境变量 修改默认字符编码

    PYTHONIOENCODING=utf8
