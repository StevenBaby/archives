# 提高 Python 代码质量的技巧

[annotation]: <id> (b2a1f807-946f-4542-809e-7922ea93d0d8)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Python)
[annotation]: <status> (public)
[annotation]: <create_time> (2018-05-11 16:20:36)


> 原文链接：<http://blog.ccyg.studio/article/b2a1f807-946f-4542-809e-7922ea93d0d8>

---


我一直觉得编程某种意义上是一门『手艺』，因为优雅而高效的代码，就如同完美的手工艺品一样让人赏心悦目。

## 避免多层分支嵌套

如果这篇文章只能删减成一句话就结束，那么那句话一定是“**要竭尽所能的避免分支嵌套**”。

过深的分支嵌套是很多编程新手最容易犯的错误之一。假如有一位新手 JavaScript 程序员写了很多层分支嵌套，那么你可能会看到一层又一层的大括号：`if { if { if { ... }}}`。俗称“**嵌套 if 地狱（Nested If Statement Hell）**”。

但是因为 Python 使用了缩进来代替 `{}`，所以过深的嵌套分支会产生比其他语言下更为严重的后果。比如过多的缩进层次很容易就会让代码超过 [PEP8](https://www.python.org/dev/peps/pep-0008/) 中规定的每行字数限制。让我们看看这段代码：

```python
def buy_fruit(nerd, store):
    """去水果店买苹果

    - 先得看看店是不是在营业
    - 如果有苹果的话，就买 1 个
    - 如果钱不够，就回家取钱再来
    """
    if store.is_open():
        if store.has_stocks("apple"):
            if nerd.can_afford(store.price("apple", amount=1)):
                nerd.buy(store, "apple", amount=1)
                return
            else:
                nerd.go_home_and_get_money()
                return buy_fruit(nerd, store)
        else:
            raise MadAtNoFruit("no apple in store!")
    else:
        raise MadAtNoFruit("store is closed!")
```

上面这段代码最大的问题，就是过于直接翻译了原始的条件分支要求，导致短短十几行代码包含了有三层嵌套分支。

这样的代码可读性和维护性都很差。不过我们可以用一个很简单的技巧：“**提前结束**” 来优化这段代码：

```python
def buy_fruit(nerd, store):
    if not store.is_open():
        raise MadAtNoFruit("store is closed!")

    if not store.has_stocks("apple"):
        raise MadAtNoFruit("no apple in store!")

    if nerd.can_afford(store.price("apple", amount=1)):
        nerd.buy(store, "apple", amount=1)
        return
    else:
        nerd.go_home_and_get_money()
        return buy_fruit(nerd, store)
```

“**提前结束**”指：在函数内使用 `return` 或 `raise` 等语句提前在分支内结束函数。比如，在新的 `buy_fruit` 函数里，当分支条件不满足时，我们直接抛出异常，结束这段这代码分支。这样的代码没有嵌套分支，更直接也更易读。

要想写出没有嵌套 `if` 的代码有时候看似很困难，但是实际上只需要换一种思维方式：

> **优先判断最不容易发生的情况，提前结束**

由于最不容易发生的情况是很容易得出结论的，所以也很容易得到返回值。而且，优先判断不容易发生的情况有个独特的优势就是**使得代码更加鲁棒**。

## 封装那些过于复杂的逻辑判断

如果条件分支里的表达式过于复杂，出现了太多的 not/and/or，那么这段代码的可读性就会大打折扣，比如下面这段代码：

```python
# 如果活动还在开放，并且活动剩余名额大于 10，为所有性别为女性，或者级别大于 3
# 的活跃用户发放 10000 个金币
if activity.is_active and activity.remaining > 10 and \
        user.is_active and (user.sex == 'female' or user.level > 3):
    user.add_coins(10000)
    return
```

对于这样的代码，我们可以考虑将具体的分支逻辑封装成函数或者方法，来达到简化代码的目的：

```python
if activity.allow_new_user() and user.match_activity_condition():
    user.add_coins(10000)
    return
```

事实上，将代码改写后，之前的注释文字其实也可以去掉了。因为后面这段代码已经达到了自说明的目的。至于具体的 什么样的用户满足活动条件？ 这种问题，就应由具体的 `match_activity_condition()` 方法来回答了。

>Hint: 恰当的封装不光直接改善了代码的可读性，事实上，如果上面的活动判断逻辑在代码中出现了不止一次的话，封装更是必须的。不然重复代码会极大的破坏这段逻辑的可维护性。

## 留意不同分支下的重复代码

重复代码是代码质量的天敌，而条件分支语句又非常容易成为重复代码的重灾区。所以，当我们编写条件分支语句时，需要特别留意，不要生产不必要的重复代码。

让我们看下这个例子：

```python
# 对于新用户，创建新的用户资料，否则更新旧资料
if user.no_profile_exists:
    create_user_profile(
        username=user.username,
        email=user.email,
        age=user.age,
        address=user.address,
        # 对于新建用户，将用户的积分置为 0
        points=0,
        created=now(),
    )
else:
    update_user_profile(
        username=user.username,
        email=user.email,
        age=user.age,
        address=user.address,
        updated=now(),
    )
```

在上面的代码中，我们可以一眼看出，在不同的分支下，程序调用了不同的函数，做了不一样的事情。但是，因为那些重复代码的存在，**我们却很难简单的区分出，二者的不同点到底在哪**。

其实，得益于 Python 的动态特性，我们可以简单的改写一下上面的代码，让可读性可以得到显著的提升：

```python
if user.no_profile_exists:
    profile_func = create_user_profile
    extra_args = {'points': 0, 'created': now()}
else:
    profile_func = update_user_profile
    extra_args = {'updated': now()}

profile_func(
    username=user.username,
    email=user.email,
    age=user.age,
    address=user.address,
    **extra_args
)
```

当你编写分支代码时，请额外关注由分支产生的重复代码块，如果可以简单的消灭它们，那就不要迟疑。

## 谨慎使用三元表达式

三元表达式是 Python 2.5 版本后才支持的语法。在那之前，Python 社区一度认为三元表达式没有必要，我们需要使用 `x and a or b` 的方式来模拟它。

事实是，在很多情况下，使用普通的 `if/else` 语句的代码可读性确实更好。盲目追求三元表达式很容易诱惑你写出复杂、可读性差的代码。

所以，请记得只用三元表达式处理简单的逻辑分支。

```python
language = "python" if you.favor("dynamic") else "golang"
```

对于绝大多数情况，还是使用普通的 `if/else` 语句吧。

##  使用“德摩根定律”

在做分支判断时，我们有时候会写成这样的代码：

```python
# 如果用户没有登录或者用户没有使用 chrome，拒绝提供服务
if not user.has_logged_in or not user.is_from_chrome:
    return "our service is only available for chrome logged in user"
```

第一眼看到代码时，是不是需要思考一会才能理解它想干嘛？这是因为上面的逻辑表达式里面出现了 2 个 `not` 和 1 个 `or`。而我们人类恰好不擅长处理过多的“否定”以及“或”这种逻辑关系。

这个时候，就该 [德摩根定律](https://zh.wikipedia.org/wiki/%E5%BE%B7%E6%91%A9%E6%A0%B9%E5%AE%9A%E5%BE%8B) 出场了。通俗的说，德摩根定律就是 `not A or not B` 等价于 `not (A and B)`。通过这样的转换，上面的代码可以改写成这样：

```python
if not (user.has_logged_in and user.is_from_chrome):
    return "our service is only open for chrome logged in user"
```

怎么样，代码是不是易读了很多？记住德摩根定律，很多时候它对于简化条件分支里的代码逻辑非常有用。


##  在条件判断中使用 all() / any()

`all()` 和 `any()` 两个函数非常适合在条件判断中使用。这两个函数接受一个可迭代对象，返回一个布尔值，其中：

- `all(seq)`：仅当 `seq` 中所有对象都为布尔真时返回 `True`，否则返回 `False`
- `any(seq)`：只要 `seq` 中任何一个对象为布尔真就返回 `True`，否则返回 `False`

假如我们有下面这段代码：

```python
def all_numbers_gt_10(numbers):
    """仅当序列中所有数字大于 10 时，返回 True
    """
    if not numbers:
        return False

    for n in numbers:
        if n <= 10:
            return False
    return True
```

如果使用 `all()` 内建函数，再配合一个简单的生成器表达式，上面的代码可以写成这样：

```python
def all_numbers_gt_10_2(numbers):
    return bool(numbers) and all(n > 10 for n in numbers)
```

简单、高效，同时也没有损失可用性。

## 使用 try/while/for 中 else 分支

让我们看看这个函数：

```python
def do_stuff():
    first_thing_successed = False
    try:
        do_the_first_thing()
        first_thing_successed = True
    except Exception as e:
        print("Error while calling do_some_thing")
        return

    # 仅当 first_thing 成功完成时，做第二件事
    if first_thing_successed:
        return do_the_second_thing()
```

在函数 `do_stuff` 中，我们希望只有当 `do_the_first_thing()` 成功调用后（也就是不抛出任何异常），才继续做第二个函数调用。为了做到这一点，我们需要定义一个额外的变量 `first_thing_successed` 来作为标记。

其实，我们可以用更简单的方法达到同样的效果：

```python
def do_stuff():
    try:
        do_the_first_thing()
    except Exception as e:
        print("Error while calling do_some_thing")
        return
    else:
        return do_the_second_thing()
```

在 `try` 语句块最后追加上 `else` 分支后，分支下的 `do_the_second_thing()` 便只会在 `try` 下面的所有语句正常执行（也就是没有异常，没有 `return`、`break` 等）完成后执行。

类似的，Python 里的 `for/while` 循环也支持添加 `else` 分支，它们表示：当循环使用的迭代对象被正常耗尽、或 `while` 循环使用的条件变量变为 `False` 后才执行 `else` 分支下的代码。

## 与 None 值的比较

在 Python 中，有两种比较变量的方法：== 和 is，二者在含义上有着根本的区别：

- ==：表示二者所指向的的值是否一致
- is：表示二者是否指向内存中的同一份内容，也就是 `id(x)` 是否等于 `id(y)`

`None` 在 Python 语言中是一个单例对象，如果你要判断某个变量是否为 `None` 时，记得使用 `is` 而不是 `==`，因为只有 `is` 才能在严格意义上表示某个变量是否是 `None`。

否则，可能出现下面这样的情况：

```python
>>> class Foo(object):
...     def __eq__(self, other):
...         return True
...
>>> foo = Foo()
>>> foo == None
True
```

在上面代码中，Foo 这个类通过自定义 `__eq__` 魔法方法的方式，很容易就满足了 `== None` 这个条件。

所以，当你要判断某个变量是否为 `None` 时，请使用 `is` 而不是 `==`。

## 留意 and 和 or 的运算优先级

看看下面这两个表达式，猜猜它们的值一样吗？

```python
>>> (True or False) and False
>>> True or False and False
```

答案是：不一样，它们的值分别是 `False` 和 `True`，你猜对了吗？

问题的关键在于：`and` 运算符的优先级大于 `or`。因此上面的第二个表达式在 Python 看来实际上是 `True or (False and False)`。所以结果是 `True` 而不是 `False`。

在编写包含多个 `and` 和 `or` 的表达式时，请额外注意 `and` 和 `or` 的运算优先级。即使执行优先级正好是你需要的那样，你也可以加上额外的括号来让代码更清晰。

## 参考资料

1. [Python 工匠：编写条件分支代码的技巧](http://www.zlovezl.cn/articles/python-else-block-secrets/)