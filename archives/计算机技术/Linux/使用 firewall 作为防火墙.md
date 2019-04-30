# 使用 firewall 作为防火墙

[annotation]: <id> (857e3554-a019-44cc-986b-3023d17386be)
[annotation]: <category> (计算机技术)
[annotation]: <create_time> (2018-08-06 14:32:50)
[annotation]: <tags> (Linux)
[annotation]: <comments> (true)

> 原文链接：<http://blog.ccyg.studio/article/857e3554-a019-44cc-986b-3023d17386be>

---


CentOS7 中默认将原来的防火墙 **iptables** 升级成了 **firewalld**, firewalld和iptables比较起来有两大好处：

- firewalld 可以动态修改单条规则，而无需像 iptables 那样，在修改了规则之后必须全部刷新才可以生效。
- firewalld 在使用上比iptables人性化很多，即使不明白 “五张表五条链”，而且对TCP/IP协议不理解，也可以实现大部分的功能。

## iptables

iptables 实际上包含五张表，


## firewall 和 iptables 的关系

firewalld 自身并不具备防火墙的功能，而是和iptables一样需要通过内核的netfilter来实现，也就是说firewalld 和 iptables 一样，他们的作用都是用于维护规则，而真正使用规则干活的是内核的netfilter，只不过firewalld和iptables的结构和使用方法不同。

我们这里所说的结构并不是firewalld的软件结构，而是配置文件的结构。



## firewalld的配置模式

在具体介绍firewalld配置文件结构之前学生先来给大家介绍一下firewalld的配置模式，firewalld的配置模式设计的非常巧妙，而且这种设计思路也非常值得我们借鉴和学习。

firewalld的配置文件以xml格式为主（主配置文件firewalld.conf例外），他们有两个存储位置

- /etc/firewalld/
- /usr/lib/firewalld/

使用时的规则是这样的：当需要一个文件时firewalld会首先到第一个目录中去查找，如果可以找到，那么就直接使用，否则会继续到第二个目录中查找。

firewalld的这种配置文件结构的主要作用是这样的：在第二个目录中存放的是firewalld给提供的通用配置文件，如果我们想修改配置， 那么可以copy一份到第一个目录中，然后再进行修改。这么做有两个好处：首先我们日后可以非常清晰地看到都有哪些文件是我们自己创建或者修改过的，其次，如果想恢复firewalld给提供的默认配置，只需要将自己在第一个目录中的配置文件删除即可，非常简单，而不需要像其他很多软件那样在修改之前还 得先备份一下，而且时间长了还有可能忘掉之前备份的是什么版本。

## 配置文件结构

firewalld的配置文件结构非常简单，主要有两个文件和三个目录：

- 文件：firewalld.conf、lockdown-whitelist.xml
- 目录：zones、services、icmptypes
- 另外，如果使用到direct，还会有一个direct.xml文件。

我们要注意，在保存默认配置的目录“/usr/lib/firewalld/”中只有我们这里所说的目录，而没有firewalld.conf、lockdown-whitelist.xml和direct.xml这三个文件，也就是说这三个文件只存在于“/etc/firewalld/”目录中。

介绍一下这些文件和目录的作用

firewalld.conf：firewalld的主配置文件，是键值对的格式，不过非常简单，只有五个配置项

DefaultZone：默认使用的zone，关于zone稍后给大家详细介绍，默认值为public

MinimalMark： 标记的最小值，linux内核会对每个进入的数据包都进行标记，目的当然是为了对他们进行区分，比如在前面给大家补充iptables五张表相关的内 容时候介绍说符合raw表规则的数据包可以跳过一些检查，那么是怎么跳过的呢？这里其实就是使用的标记，当然对数据包的标记还有很多作用。这里所设置的 MinimalMark值就是标记的最小值，默认值为100，一般情况下我们不需要对其进行修改，但是如果我们有特殊需要的时候就可以通过对其进行修改来 告诉linux所使用标记的最小值了，比如我们需要给符合某条件的数据包标记为123，这时候为了防止混淆就需要将MinimalMark设置为一个大于 123的值了

CleanupOnExit：这个配置项非常容易理解，他表示当退出firewalld后是否清除防火墙规则，默认值为yes

Lockdown： 这个选项跟D-BUS接口操作firewalld有关，firewalld可以让别的程序通过D-BUS接口直接操作，当Lockdown设置为yes的 时候就可以通过lockdown-whitelist.xml文件来限制都有哪些程序可以对其进行操作，而当设置为no的时候就没有限制了，默认值为 no

IPv6_rpfilter：其功能类似于rp_filter，只不过是针对ipv6版的，其作用是判断所接受到的包是否是伪造的，检查方式主要是通过路由表中的路由条目实现的，更多详细的信息大家可以搜索uRPF相关的资料，这里的默认值为yes

lockdown-whitelist.xml：当Lockdown为yes的时候用来限制可以通过D-BUS接口操作firewalld的程序

direct.xml：通过这个文件可以直接使用防火墙的过滤规则，这对于熟悉iptables的用户来说会非常顺手，另外也对从原来的iptables到firewalld的迁移提供了一条绿色通道

zones：保存zone配置文件

services：保存service配置文件

icmptypes：保存和icmp类型相关的配置文件

在firewalld的使用中最基础也是最重要的就是对zone的理解，不过现在还普遍理解的不是很透彻，下面就来给大家详细介绍一下zone到底是什么。

## zone

firewalld默认提供了九个zone配置文件

drop（丢弃）
任何接收的网络数据包都被丢弃，没有任何回复。仅能有发送出去的网络连接。

block（限制）
任何接收的网络连接都被 IPv4 的 icmp-host-prohibited 信息和 IPv6 的 icmp6-adm-prohibited 信息所拒绝。

public（公共）
在公共区域内使用，不能相信网络内的其他计算机不会对您的计算机造成危害，只能接收经过选取的连接。

external（外部）
特别是为路由器启用了伪装功能的外部网。您不能信任来自网络的其他计算，不能相信它们不会对您的计算机造成危害，只能接收经过选择的连接。

dmz（非军事区）
用于您的非军事区内的电脑，此区域内可公开访问，可以有限地进入您的内部网络，仅仅接收经过选择的连接。

work（工作）
用于工作区。您可以基本相信网络内的其他电脑不会危害您的电脑。仅仅接收经过选择的连接。

home（家庭）
用于家庭网络。您可以基本信任网络内的其他计算机不会危害您的计算机。仅仅接收经过选择的连接。

internal（内部）
用于内部网络。您可以基本上信任网络内的其他计算机不会威胁您的计算机。仅仅接受经过选择的连接。

trusted（信任）
可接受所有的网络连接。
指定其中一个区域为默认区域是可行的。当接口连接加入了 NetworkManager，它们就被分配为默认区域。安装时，firewalld 里的默认区域被设定为公共区域。

他们都保存在“/usr/lib/firewalld/zones/”目录下。这些zone之间是什么关系？他们分别适用用哪些场景呢？

为了弄明白这些问题大家需要先明白zone的本质含义。在上一节给大家介绍防火墙时说过防火墙就相当于一个门卫，门卫对具体某个来访的人判断是否应该放行是依靠规则来判断的，而我们这里的zone其实就是一套规则集，或者说是一套判断的方案。

理解了这层含义firewalld就容易了，比如上面的九个zone其实就是九种方案，而且起决定作用的其实是每个xml文件所包含的内容，而不是文件名，所以大家不需要对每种zone（每个文件名）的含义花费过多的精力，比如trusted这个zone会信任所有的数据包，也就是说所有数据包都会 放行，但是public这个zone只会放行其中所配置的服务，其他的一律不予放行，其实我们如果将这两个文件中的内容互换一下他们的规则就换过来了，也就是public这个zone会放行所有的数据包，下面我们来看一下这两个文件的内容 

public.xml

```xml
<?xml version="1.0" encoding="utf-8"?>  
<zone>    
<short>Public</short>    
<description>For use in public areas. You do not trust the other computers on networks to not harm your computer. Only selected incoming connections are accepted.</description>  
<service name="ssh"/>  
<service name="dhcpv6-client"/>  
</zone>  
```

trusted.xml
```xml
<?xml version="1.0" encoding="utf-8"?>  
<zone target="ACCEPT">    
<short>Trusted</short>  
<description>All network connections are accepted.</description>  
</zone> 
```

我们要特别注意trusted.xml中zone的target，就是因为他设置为了ACCEPT，所以才会放行所有的数据包，而 public.xml中的zone没有target属性，这样就会默认拒绝通过，所以public这个zone（这种方案）只有其中配置过的服务才可以通 过。
其他的zone大家可以自己打开xml文件来看一下，这里就不一一介绍了，关于zone配置文件的详细结构及含义后面再给大家进行讲解，下面再给大家介绍一下firewalld中的service。

## service

service是firewalld中另外一个非常重要的概念，不过其含义是非常简单的。还是拿门卫的例子来给大家做解释，在iptables 的时代我们给门卫下达规则时需要告诉他“所有到22号楼的人全部予以放行”、“所有到80号楼的人全部予以放行”等等，不过到了firewalld的时代 就不需要这样了，而是可以直接下达像“到销售部的全部予以放行”这样的命令，然后门卫再一查发现销售部在80号楼，那么所有到80号楼的人门卫就都会放行了。我们这里的楼牌号和端口号相对应，部门名和服务名相对应，这样大家应该就可以理解service的作用了。

从端口号改为服务名主要有两个好处：首先是使用服务名配置的语义清晰，不容易出错；其次在对某个服务的端口号进行修改的时候只需要修改相应的 service文件就可以了，而不需要再修改防火墙方案——zone。这其实跟DNS将ip地址和域名关联了起来是一样的道理。下面再来给大家介绍一下service的配置文件。

service配置文件的命名规则是<服务名>.xml，比如ssh的配置文件是ssh.xml，http的配置文件是 http.xml等，他们默认保存在“/usr/lib/firewalld/services/”目录下，常见的服务其中都可以找到，如果我们想修改某个服务的配置，那么可以复制一份到“/etc/firewalld/services/”目录下然后进行修改就可以了，要想恢复默认配置直接将我们自己的配置文件删除就可以了。我们来看一下ssh服务的ssh.xml文件

ssh.xml
```xml
<?xml version="1.0" encoding="utf-8"?>  
<service>    
<short>SSH</short>    
<description>  
    Secure Shell (SSH) is a protocol for logging into and executing commands on remote machines.   
    It provides secure encrypted communications. If you plan on accessing your machine remotely via SSH over a firewalled interface,   
    enable this option. You need the openssh-server package installed for this option to be useful.  
</description>  
<port protocol="tcp" port="22"/>  
</service>  
```

可以看到这里配置了tcp的22号端口，所以将ssh服务配置到所使用的zone（默认public）中后tcp的22号端口就开放了。如果我们想将ssh的端口修改为222，那么只需要将ssh.xml复制一份到“/firewalld/services/”中，然后将端口号修改为222就可以了。当然直接修改“/usr/lib/firewalld/services/”中的配置文件也可以实现，但是强烈建议不要那么做，原因相信大家都明白。

明白原理之后使用起来就可以非常灵活了，比如我们将“/etc/firewalld/services/ssh.xml”文件复制一份到“/etc/firewalld/services/”中，然后将名字改为abc.xml，并且将abc这个服务配置到所使用的zone中，这时22端口就会开放。也就是说在zone中所配置的服务其实跟实际的服务并不存在直接联系，而是和相应配置文件中配置的内容有关系。

## 配置方法

firewalld的配置方法主要有三种：

- firewall-config 图形化工具
- firewall-cmd 命令行工具
- 和直接编辑xml文件

## firewall-cmd

### 启用和禁用

```sh
systemctl disable --now iptables.service
systemctl disable --now ip6tables.service
systemctl disable --now etables.service
systemctl disable --now ipset.service
dnf install firewalld firewall-config firewall-applet
systemctl unmask --now firewalld.service
systemctl enable --now firewalld.service
```

### 获取服务状态

```sh
firewall-cmd --state
systemctl status firewalld
```

### 重新加载 firewalld

```sh
# 重新加载，不中断连接
firewall-cmd --reload

# 重新加载 中断连接
firewall-cmd --complete-reload
```

### 添加服务<sup>[3]</sup>

```sh
# 添加服务
firewall-cmd --permanent --new-service=myservice

# 配置服务

firewall-cmd --permanent --service=myservice --set-description=description
firewall-cmd --permanent --service=myservice --set-short=description
firewall-cmd --permanent --service=myservice --add-port=portid[-portid]/protocol
firewall-cmd --permanent --service=myservice --add-protocol=protocol
firewall-cmd --permanent --service=myservice --add-source-port=portid[-portid]/protocol
firewall-cmd --permanent --service=myservice --add-module=module
firewall-cmd --permanent --service=myservice --set-destination=ipv:address[/mask]
```

### 打开端口或者服务

```sh
firewall-cmd --zone=public --add-port=80/tcp

firewall-cmd --permanent --zone=public --add-port=80/tcp

firewall-cmd [--zone=<zone>] --add-service=[service] [--permanent]
```


### 查看 zones

```sh
firewall-cmd --get-zones
firewall-cmd --get-default-zone
```

### 查看 services

```sh
# 获取所有服务
firewall-cmd --get-services

# 获取已用服务
firewall-cmd --list-services [--zone=<zone>]
```

### 获取所有支持的 ICMP 类型

```sh
firewall-cmd --get-icmptypes
```

### 获取活动的区域

```sh
firewall-cmd --get-active-zones
```

## 参考资料

- [5分钟理解防火墙firewalld](https://blog.csdn.net/dream361/article/details/54022470)
- [firewalld详解](http://www.sa-log.com/282.html)
- [firewalld document](http://www.firewalld.org/documentation/)