# Django 常用功能和配置

[annotation]: <id> (67c9c264-e7b3-47e9-aa0a-7e10f4971c1e)
[annotation]: <status> (public)
[annotation]: <create_time> (2019-06-25 15:50:30)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Python|Django)
[annotation]: <comments> (false)

> 原文链接：<http://blog.ccyg.studio/article/67c9c264-e7b3-47e9-aa0a-7e10f4971c1e>

---

## sqlite 数据库配置

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
```

## MySQL 数据库配置

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',   # 数据库引擎
        'NAME': 'mydb',         # 你要存储数据的库名，事先要创建之
        'USER': 'root',         # 数据库用户名
        'PASSWORD': '1234',     # 密码
        'HOST': 'localhost',    # 主机
        'PORT': '3306',         # 数据库使用的端口
    }
}
```