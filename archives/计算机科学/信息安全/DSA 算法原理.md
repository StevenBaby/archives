# DSA 算法原理及实例

[annotation]: [id] (acb276f0-be38-490e-8fb3-94907d3e997a)
[annotation]: [status] (public)
[annotation]: [create_time] (2021-09-21 20:36:18)
[annotation]: [category] (计算机科学)
[annotation]: [tags] (密码学|数论)
[annotation]: [comments] (true)
[annotation]: [url] (http://blog.ccyg.studio/article/acb276f0-be38-490e-8fb3-94907d3e997a)

## DSA 的主要参数

**全局公开密钥分量**

- $p$：素数，要求 $2^{L-1}<p<2^L$，且 $L$ 为 $64$ 的倍数

> 取 $p = 127$

- $q$：$(p - 1)$ 的素因子，$2^{159} < q < 2^{160}$，即比特长度为 $160$ 位

> 则 $p - 1 = 126 = 2 \times 3^2 \times 7$，故取 $q = 7$

- $g=h^{p-1 \over q} \bmod p$，其中 $h$ 是一个整数，$1 < h < (p - 1)$ 且 $h^{p-1 \over q} \bmod p > 1$

> 则 ${p - 1 \over q} = 18$，取 $h = 5$, 则 $g = h^{p-1 \over q} \bmod p = 64 > 1$ 符合要求
> 
> 于是 $p = 127, q=7, g=64$

---

**用户私有密钥**

$x$：随机数或伪随机数，要求 $0 < x < q$

> 取 $x = 6$

---

**用户公开密钥**

$y = g^x \bmod p$

> $y = 64^{6}\ \bmod 127 = 2$

---

**随机数 $k$**

随机数或伪随机数，要求 $0 < k < q$

> 取 $k = 3$

---

## DSA 签名过程

1. 用户随机选取 $k$

> $k = 3$

2. 计算 $e = h(M)$

> 假设 $e = h(M) = 5678$

3. 计算 $r = (g^k \bmod p) \bmod q$

> $r = (g^k \bmod p) \bmod q = (64^{3} \bmod 127) \bmod 7 = 2$

4. 计算 $s = k^{-1}(e + x \cdot r)\ \bmod q$

> $k^{-1}\bmod 7 =-2$ 可用 [扩展欧几里得算法](http://blog.ccyg.studio/article/72a58aa9-bb66-4f83-8487-047e5a627d8a) 求解
> 
> $s = k^{-1}(e + x \cdot r)\ \bmod q = -2 \times (5678 + 6 \times 2)\ \bmod 7= 2$

5. 输出 $(r, s)$，即为消息 $M$ 的数字签名

> 即 $(2, 2)$

## DSA 验证过程

1. 接收者收到 $M, r, s$ 后，首先验证 $0 < r < q, 0 < s < q$

> $(M, 2, 2)$ 验证成功

2. 计算 $e = h(M)$

> $e = h(M) \xlongequal{假设} 5678$

1. 计算 $w = s^{-1} \bmod q$

> $w = s^{-1} \bmod q = s^{-1} \bmod 7 = -3$

4. 计算 $u_1 = e\cdot w\ \bmod q$

> $u_1 = e\cdot w\ \bmod q = 5678 \times (-3) \bmod 7 = 4$

5. 计算 $u_2 = r\cdot w\ \bmod q$

> $u_2 = r\cdot w\ \bmod q = 2 \times (-3) \bmod 7 = 1$

6. 计算 $v = [(g^{u_1}\cdot y^{u_2}) \bmod p] \bmod q$

> $v = [(g^{u_1}\cdot y^{u_2}) \bmod p] \bmod q = [(64^{4}\times 2^{1}) \bmod 127] \bmod 7 = 2$

7. 如果 $v = r$，则确认签名正确，否则拒绝；

> $v = r = 2$，验正签名成功；
