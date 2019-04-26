# 用 mitmproxy 做 HTTP 代理服务器

[annotation]: <id> (cbcfacca-45b5-44fa-b84f-c707fa60b17e)
[annotation]: <status> (public)
[annotation]: <create_time> (2018-08-06 14:32:50)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Python)
[annotation]: <comments> (true)

> 原文链接：<http://blog.ccyg.studio/article/cbcfacca-45b5-44fa-b84f-c707fa60b17e>

---


mitmproxy 是一个强大的代理工具，其中包括了:

- mitmproxy 交互式的http, https代理工具，有一个控制台界面
- mitmdump 控制台版本的mitmproxy，类似与tcpdump
- mitmweb 网页端的mitmproxy

具体的命令行工具就不解释了，刨坑代填，下面记录一下遇到的问题。

## 需求

需要爬去flash中的一些内容，但是正常情况下无法再浏览器中操作flash，这时候需要一个代理服务器，当服务器请求一些需要的链接的时候，再来处理这些链接。具体获取的内容可能是图片或者其他信息。

## 问题

主要的问题在于，我实际上需要实现一个代理服务器，运行在爬虫程序的某个线程，当获取到链接之后，再通知爬虫线程执行一些命令。最新的 **mitmproxy** 把与python的交互设计成了插件模式，这时候需要另起一个进程来做代理。但是进程通信的复杂度比线程通信高了不少，所以还是希望通过实现代理服务器子类的方式来处理。通过信息收集，mitmproxy实际上很不屑与实现子类的方式，该方式从版本 1.18 开始就被舍弃，变成了现在的插件模式。

## 解决方案

但是，皇天不负有心人，通过搜索github，发现了一种实现方式，但是再shutdown的时候有一些问题，目前还没解决，但是主要的问题已经解决了。就是继承DumpServer来实现子类和写一个处理请求的插件，具体代码如下。

```python
from mitmproxy.options import Options
from mitmproxy.proxy.config import ProxyConfig
from mitmproxy.proxy.server import ProxyServer
from mitmproxy.tools.dump import DumpMaster


class Addon(object):

    def request(self, flow):
        # do something in request
        pass

    def response(self, flow):
        # do something in response
        pass


class ProxyMaster(DumpMaster):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def run(self):
        try:
            DumpMaster.run(self)
        except KeyboardInterrupt:
            self.shutdown()


def main():
    options = Options(listen_host='0.0.0.0', listen_port=8080)
    config = ProxyConfig(options)
    master = ProxyMaster(options, with_termlog=False, with_dumper=False)
    master.server = ProxyServer(config)
    master.addons.add(Addon())
    master.run()


if __name__ == '__main__':
    main()
``` 

只需要实现 Addon 的 request 或者 response 方法就可以了，这个实现具体看自己的需求。


## 保存相应内容

```python
class Addon(object):

    def response(self, flow):
        url = flow.request.url
        if url != "what you what to catch":
            return
        filename = "path to your file"
        content = flow.response.data.content
        with open(filename, "wb") as file:
            file.write(content)
```