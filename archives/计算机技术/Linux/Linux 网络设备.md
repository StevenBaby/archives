# Linux 网络设备

[annotation]: [id] (127da5b5-8ff2-4db7-9b3c-943072f5483a)
[annotation]: [status] (public)
[annotation]: [create_time] (2022-08-03 22:57:18)
[annotation]: [category] (计算机技术)
[annotation]: [tags] (Linux)
[annotation]: [comments] (false)
[annotation]: [url] (http://blog.ccyg.studio/article/127da5b5-8ff2-4db7-9b3c-943072f5483a)

## 虚拟网络设备

- tap/tun [1] 可以在用户模式发送和接受包，可以被认为是点对点的以太网设备，不过不是物理网卡上的数据，而是用户模式应用程序。
- veth pair [8] 是虚拟的以太网设备，可以再两个网络命名空间之间创建一个连接，通过物理网络设备。但同样作为独立的网络。
- bridge [7] 将两个以太网以协议独立的方式连接起来，包以以太网地址进行转发，运行在数据链路层，Linux bridge 实现了 ANSI/IEEE 802.1d 标准的一个子集，最早在 Linux 2.2 中首次完成，由 Lennert Buytenhek 重写，已经被集成到 Linux 2.4 和 2.6 系列。
- vlan [5][6] 是Virtual LAN 的缩写，是虚拟出的一个局域网，用于分离网络广播区域，可以利用 vlan 在一个交换机上虚拟出多个彼此分离的网络。vlan 的实现有两种标准 802.1q 和 ISL，ISL 出现的更早，不过只有思科的交换机支持这种协议。
- bond 设备 [4] 将多个网络设备聚合成为一个逻辑网络设备，以提供热备和负载均衡。大多数的Linux 发行版已经将bond 设备作为内核模块。
- MACsec [9][10] Media Access Control Security (MACsec, IEEE 802.1AE)，使用 GCM-AES-128 算法来加密和认证所有局域网中的流量。不仅可以保护 IP 协议，而且还可以保护地址解析协议 (ARP)，邻居发现(Neighbor Discovery) 或 DHCP(Dynamic Host Configuration Protocol) 动态主机配置协议，IPsec 在网络层，SSL 和 TLS 在应用层，MACsec 在数据链路层。
- team 设备 [3] 提供一种机制将多个网络控制器模拟成一个链路层逻辑设备，该过程被称为通道绑定，以太网绑定，通道团队，链路集合，在Linux 中已经被实现为 bond 设备。与之不同的是，team 设备是模块化、用户空间驱动，功耗低、效率高。配置 team 设备的方法与 bond 设备大不相同 
- wireguard [11] 是一个 VPN 基础设施。

### 网络设备的名称 

传统的网络设备（如网卡）在 Linux 中被枚举成 eth[0123…]s0，但是在实际的虚拟机中出现了 ens33 这种命名方式，于是本着好奇的心态，去研究了一下这种命名方式改变原因。

传统的这命名方式不够好，并没有说明网络设备的细节，于是就有了新的命名方式 [12]。新命名方式一网络的固件、拓扑和位置等信息来为网络设备命名，这里的好处在于命名是自动进行的，并且有很多好处，这种命名方式是可预测的，即使是网络设备的添加和移除，也不会改变相应网络设备的名字，但同时也有一些缺点，就是这种命名方式并没有传统的 eth 和 wla 更容易阅读。

默认情况下, systemd 将对网络设备使用以下策略来命名：

1. 固件或BIOS 为板载设备提供的索引号可用 （如：eno1）
2. 固件或 BIOS 提供 PCIE 接口的索引号 （如 ens1）
3. 通过插口的物理位置 (enp2s0)
4. 使用 MAC 地址 (如 enx78e7d1ea46da)
5. 否则使用传统的命名方式

## 其他

slirp [13][14] 是一个用户模式网络库，最初设计以终端链路来提供 PPP/SLIP 协议, slirp 是通用的 TCP/IP 模拟器，广泛应用于虚拟机以提供虚拟网络服务。

## 网络配置

参考以下命令：

- lspci
- dmesg
- iproute2

## 参考文献

1. https://www.kernel.org/doc/html/latest/networking/tuntap.html
2. https://www.kernel.org/doc/html/latest/networking/index.html
3. https://github.com/jpirko/libteam
4. https://www.kernel.org/doc/html/latest/networking/bonding.html
5. https://wiki.archlinux.org/title/VLAN
6. https://wiki.linuxfoundation.org/networking/vlan
7. https://wiki.linuxfoundation.org/networking/bridge
8. https://man7.org/linux/man-pages/man4/veth.4.html
9. https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/security_guide/sec-using-macsec
10. https://developers.redhat.com/blog/2016/10/14/macsec-a-different-solution-to-encrypt-network-traffic
11. https://wiki.archlinux.org/title/WireGuard
12. [Chapter 11. Consistent Network Device Naming](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/networking_guide/ch-consistent_network_device_naming)
13. https://github.com/rd235/libslirp
14. https://github.com/virtualsquare/libvdeslirp
