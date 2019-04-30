# Django 故障排除

[annotation]: <id> (e6355db6-91d9-40b7-9cbd-6f3494bc2e81)
[annotation]: <status> (public)
[annotation]: <create_time> (2019-04-11 11:00:22)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Python|Django)


> 原文链接：<http://blog.ccyg.studio/article/e6355db6-91d9-40b7-9cbd-6f3494bc2e81>

---


## Django 时区操作

一般情况下，习惯了Linux的用户在 Django 开发中设置的时区是 `Asia/Shanghai` 也就是上海。

Django 开发过程中，使用时区的的情况下，设置 settings 中 `USE_TZ = True`，这样就会有两种时间，一种没有时区信息的，用     `datetime` 生成，一种带时区信息的，用 `timezone.now` 生成。

有时候需要在已经生成的时间进行转换，一种情况是已经有了时区，需要去掉，一种是没有时区，需要加上时区。更多的是没有时区，然后加上时区。

一种实现方式是，直接替换时区信息，如下所示

```python
import datetime
from django.utils import timezone

time = datetime.datetime.now() # 没有时区
time = time.replace(tzinfo=timezone.get_default_timezone())
```

这样做有一些问题，就是北京时间比上海时间差6分钟，常常会有时间不准确的情况。打印出来的时间后面，显示的是 **+08:06**。为了去掉这个 06 可以使用本地化的方式，如下所示。

```python
import datetime
from django.utils import timezone

time = datetime.datetime.now() # 没有时区
time =  timezone.get_default_timezone().localize(datetime)
```

如果时间已经有时区信息了，要想去掉那个 06 可以使用下面的方法，先去掉时区信息，然后再进行本地化，如下所示。

```python
import datetime
from django.utils import timezone

def localize(datetime):
    if timezone.is_aware(datetime):
        datetime = datetime.replace(tzinfo=None)
    return timezone.get_default_timezone().localize(datetime)
```

## django.db.utils.OperationalError: (2006, 'MySQL server has gone away')

首先，出现 **MySQL server has gone away** 错误的根本原因，是由于MySQL服务器超时，并关闭了与客户端的连接导致的。

默认情况下，如果8小时内对mysql没有请求的话，服务器就会自动断开。可以通过修改全局变量 wait_time 和 interactive_timeout 两个变量的值来进行修改。

不过，这里解释的是django的错误，所以这里只说明从django端来解决这个错误。

django默认情况下对于连接是持续的。但是MySQL端默认只有8个小时，所以要想解决这个问题很简单，在配置文件中修改mysql的最长连接时间就可以了。

所以修改 `settings.py` 文件如下，加入 **CONN_MAX_AGE** 选项:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'CONN_MAX_AGE': 3600,
        # 其他配置信息
    }
}
```
其中 3600 是django对于MySQL连接的最长时间，之后就重新连接。默认情况下 MySQL 数据库的超时时间是 **28800**，小于这个值应该就可以。

由于，django 连接超时的判断只会在请求发起是执行。所以如果程序的运行状态并不是web应用程序，而只是用到了django的ORM来处理数据，那么就需要手动判断连接是否有效，进而关闭不可用的连接，新建新的连接。具体的处理方法也很方便，示例如下：

```python
from functions import wraps
from django.db import close_old_connections

def check_connection(func):

    @wraps(func)
    def check(*args, **kwargs):
        close_old_connections()
        return func(*args, **kwargs)
    return check

```

只需要调用 close_old_connections 函数就可以了，如果想要方便一点，可以定义如上装饰器，在用到数据库操作的地方检测一下就可以了。
