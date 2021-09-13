# RSA 算法原理

[annotation]: [id] (3c22edc1-3de9-464d-9325-a589bd095968)
[annotation]: [status] (public)
[annotation]: [create_time] (2021-09-13 17:54:42)
[annotation]: [category] (计算机科学)
[annotation]: [tags] (密码学|数论)
[annotation]: [comments] (true)
[annotation]: [url] (http://blog.ccyg.studio/article/3c22edc1-3de9-464d-9325-a589bd095968)

## 一点历史

1977年，三位数学家 Rivest、Shamir 和 Adleman 设计了一种算法，可以实现非对称加密。这种算法用他们三个人的名字的首字母命名，叫做 RSA 算法。从那时直到现在，RSA 算法一直是最广为使用的 **非对称加密算法**。毫不夸张地说，只要有计算机网络的地方，就有 RSA 算法。

## 互质关系

如果两个正整数，除了 $1$ 以外，没有其他公因子，我们就称这两个数是 **互质** 关系，或者 **互素** 关系。

关于互质关系，不难得到以下结论:

- 任意两个质数构成互质关系，比如 $13$ 和 $61$

- 一个数是质数，另一个数只要不是前者的倍数，两者就构成互质关系，比如 $3$ 和 $10$

- 如果两个数之中，较大的那个数是质数，则两者构成互质关系，比如 $97$ 和 $57$

- $1$ 和任意一个自然数是都是互质关系，比如 $1$ 和 $99$

- $p$ 是大于 $1$ 的整数，则 $p$ 和 $p-1$ 构成互质关系，比如 $57$ 和 $56$

- $p$ 是大于 $1$ 的奇数，则 $p$ 和 $p-2$ 构成互质关系，比如 $17$ 和 $15$

## 欧拉函数

欧拉函数 $\varphi(n)$ 是小于或等于 $n$ 的正整数中与 $n$ 互质的数的个数；

1. 若 $n = 1$，则 $\varphi(n) = \varphi(1) = 1$

2. 若 $n$ 为质数，则 $\varphi(n) = n - 1$

3. 若 $n = p^k$, 其中 $p$ 为质数， $k$ 是大于 $1$ 的整数，则

$$\varphi(p^k) = p^k - p^{k - 1}$$

这是因为只有当一个数不包含质数 $p$，才可能与 $n$ 互质。而包含质数 $p$ 的数一共有 $p^{k-1}$ 个，即 $p, 2p, 3p, \cdots ,p^{k-1} \cdot p$，把它们去除，剩下的就是与 $n$ 互质的数

上面的式子还可以写成下面的形式：

$$\varphi(p^k) = p^k - p^{k - 1} = p^k\left(1 - {1 \over p}\right)$$

可以看出，上面的第二种情况是 $k = 1$ 时的特例

4. 若 $m, n$ 互质，则 $\varphi(mn) = \varphi(m)\varphi(n)$

    TODO: 证明

5. 因为任意一个大于 $1$ 的正整数 $m$，都可以写成 $n$ 个质数的积，即：

$$m = \prod_{i=1}^n p_i^{k_i}$$

则：

$$\begin{aligned}
\varphi(m) =& \varphi\left(\prod_{i=1}^n p_i^{k_i}\right) \\
\xlongequal{\varphi(mn) = \varphi(m)\varphi(n)}& \prod_{i=1}^n\varphi (p_i^{k_i}) \\
\xlongequal{\varphi(p^k) = p^k\left(1 - {1 \over p}\right)}& \prod_{i=1}^n p_i^{k_i}\left(1 - {1 \over p_i}\right) \\
=& n\prod_{i=1}^n\left(1 - {1 \over p_i}\right) \\
\end{aligned}$$

于是有，欧拉公式：

> $$\varphi(m) = m\prod_{i=1}^n\left(1 - {1 \over p_i}\right)$$

比如，计算 $1323$

$\varphi(1323) = \varphi(3^3 \times 7^2) = 1323(1 - {1 \over 3})(1 - {1\over 7}) = 756$

## 欧拉定理

如果两个正整数 $a, n$ 互质，则 $n$ 的欧拉函数 $\varphi(n)$ 可以让下面的等式成立：

> $a^{\varphi(n)} \equiv 1 (\textrm{mod}\ n)$

假设正整数 $a$ 与质数 $p$ 互质，因为质数 $p$ 的 $\varphi(p)$ 等于 $p - 1$，则得到 **费马小定理**

> $a^{p - 1} \equiv 1(\textrm{mod}\ p)$ 

## 模逆元（模反元素）

一整数 $a$ 对同余 $n$ 之模逆元是指满足如下公式的整数 $b$

> $ab \equiv 1 (\textrm{mod}\ n)$

整数 $a$ 对模数 $n$ 之模逆元存在的充分必要条件是 $a$ 和 $n$ 互质

欧拉定理可以用来证明模逆元必然存在

$a^{\varphi(n)} = a \cdot a^{\varphi(n) - 1} \equiv 1(\textrm{mod}\ n)$

## 密钥生成的步骤

1. 随机选择两个不相等的质数 $p$ 和 $q$；

> 取 $p=61$，$q=53$

---

2. 计算 $p$ 和 $q$ 的乘积 $n=p \cdot q$；

> $n = p \cdot q = 61 \times 53 = 3233$

---

3. 计算 $n$ 的欧拉函数 $\varphi(n) = (p - 1)(q - 1)$；

> $\varphi(n) = (p - 1)(q - 1) = 60 \times 52 = 3120$

---

4. 随机选择一个整数 $e$, 条件是 $1 < e < \varphi(n)$，且 $e$ 与 $\varphi(n)$ 互质；

> 假设选择了 $e = 17$，实际应用中，通常选择 $65537$？

---

5. 计算 $e$ 对于 $\varphi(n)$ 的模反元素 $d$，即满足条件 $e \cdot d \equiv 1 \mod \varphi(n)$

上面的式子等价于 $e \cdot d = k \varphi(n) + 1$, $k \in \mathbb{Z}$

找 $d$ 的过程实际上是对以下方程的未知数 $(d, k)$ 求解：

> $e \cdot d+ \varphi(n)\cdot k = 1$

代入已知数得方程：

$17 d + 3120 k = 1$

这个方程可使用 **扩展欧几里得算法** 求解


```python
def ext_euclid(e, phi):
    if phi == 0:
        return 1, 0, e

    x, y, q = ext_euclid(phi, e % phi)
    x, y = y, (x - (e // phi) * y)
    return x, y, q
```

假设得到一组解为 $(2753, -15)$，即 $d=2753$

---

6. 将 $n$ 和 $e$ 封装成公钥，$n$ 和 $d$ 封装成私钥；

$n = 3233$, $e=17$, $d=2753$

所以，公钥就是 $(3233, 17)$，私钥就是 $(3233, 2753)$

---

## 加密和解密

加密要用公钥 $(n, e)$, 计算下式：

> $m^e \equiv c\ ( \textrm{mod}\ n)$

假设 $m = 65$，那么可以得到如下等式：

$65^{17} \equiv  2790\ ( \textrm{mod}\ n)$

用 Python 代码来算就是 `c = (m ** e) % n`

现在就可以使用信道发送密文 $2790$ 了

----

假设信宿收到了密文 $2790$，现在要使用密钥 $(3233, 2753)$ 来解密，可以证明，下式一定成立：

> $c^d \equiv m \ ( \textrm{mod}\ n)$

也就是说 `(c ** d) % n == m`，则

$m = c^d \textrm{mod}\ n = 2790^{2753}\ \textrm{mod}\ 3233 = 65$

这样，接收方就获得了发送方发送的明文 $m = 65$；

至此，加密解密过程全部结束。

我们可以看到，如果不知道 $d$，就没有办法从 $c$ 求出 $m$。而前面已经说过，要知道 $d$ 就必须分解 $n$，这是极难做到的，所以 RSA 算法保证了通信安全。

你可能会问，公钥 $(n,e)$ 只能加密小于 $n$ 的整数 $m$，那么如果要加密大于 $n$ 的整数，该怎么办？

有两种解决方法：

- 一种是把长信息分割成若干段短消息，每段分别加密；
- 另一种是先选择一种 **对称加密算法**，用这种算法的密钥加密信息，再用 RSA 公钥加密对称加密算法的密钥；

## 私钥解密的证明

最后，我们来证明，为什么用私钥解密，一定可以正确地得到 $m$。也就是证明下面这个式子：

$$c^d \equiv m \ (\textrm{mod}\ n)$$

**证明：**

根据加密规则，$m^e \equiv c \ (\textrm{mod}\ n)$；

于是，$c = m^e - kn, (k \in \mathbb{Z})$

将 $c$ 带入解密规则得 $(m^e - kn)^d \equiv m \ (\textrm{mod}\ n)$

二项式定理展开，带有 $kn$ 的项在模运算中可以舍掉，等价于 $m^{ed} \equiv m \ (\textrm{mod}\ n)$

由于 $ed \equiv 1 \ (\textrm{mod}\ \varphi(n))$

则 $ed = h\varphi(n) + 1, (h \in \mathbb{Z})$

将 $ed$ 代入得 

$$m^{h\varphi(n) + 1} \equiv m \ (\textrm{mod}\ n)$$

---

若 $m, n$ 互质，则根据欧拉定理 $m^{\varphi(n)} \equiv 1  \ (\textrm{mod}\ n)$，可得 $m^{\varphi(n)} = k_1n + 1$

于是 

$$\begin{aligned}
& m^{h\varphi(n) + 1} \equiv m \ (\textrm{mod}\ n) \\
& [m^{\varphi(n)}]^h \cdot m \equiv m \ (\textrm{mod}\ n) \\
& [k_1n + 1]^h \cdot m \equiv m \ (\textrm{mod}\ n) \\
& m \equiv m \ (\textrm{mod}\ n) \\
\end{aligned}$$

原式得到证明；

---

若 $m, n$ 不互质，由于 $n = p \cdot q$，则必有 $m = kp$ 或 $m = kq$

由 **中国余数定理** 有，$(m^e)^d \equiv m \ (\textrm{mod}\ p)$ 和 $(m^e)^d \equiv m \ (\textrm{mod}\ q)$

设 $m = kp$, 由于 $p$ 为素数, $m < n$，所以 $k, p$ 一定互质，根据欧拉定理，下面的式子成立；

$$(kp)^{q-1} \equiv 1 \ (\textrm{mod}\ q)$$

由于 $\varphi(n) = (p-1)(q-1)$，进一步得到：

$$[(kp)^{q-1}]^{h(p-1)} \cdot kp \equiv kp \ (\textrm{mod}\ q)$$

即：

$$1^{h(p-1)} \cdot kp \equiv kp \ (\textrm{mod}\ q)$$

$$kp^{ed} \equiv kp \ (\textrm{mod}\ q)$$

$$m^{ed} \equiv m\ (\textrm{mod}\ n)$$

原式得到证明，$m=kq$ 的情况完全对称，类似可证；

## RSA 算法的可靠性

上面生成密钥的步骤中，一共出现六个数字

$p, q, n, \varphi(n), e, d$


这六个数字中，公钥用到了两个 $(n, e)$, 其余四个数字是不公开的，其中最重要的是 $d$, $(n, d)$ 组成了私钥，一旦 $d$ 泄露就等于私钥泄露。

那么，有无可能在已知 $(n, e)$ 的情况下，推导出 $d$ ？

1. $ed \equiv 1 (\textrm{mod}\ \varphi(n))$，只有知道 $e$ 和 $\varphi(n)$，才能算出 $d$

2. $\varphi(n)=(p-1)(q-1)$，只有知道 $p$ 和 $q$，才能算出 $\varphi(n)$

3. $n=pq$，只有将 $n$ 因数分解，才能算出 $p$ 和 $q$

> 结论：如果 $n$ 可以被因数分解，$d$ 就可以算出，也就意味着私钥被破解

## 参考资料

- <http://www.ruanyifeng.com/blog/2013/06/rsa_algorithm_part_one.html>
- <https://www.ruanyifeng.com/blog/2013/07/rsa_algorithm_part_two.html>
- <https://en.wikipedia.org/wiki/RSA_(cryptosystem)>
- <https://crypto.stackexchange.com/questions/2884/rsa-proof-of-correctness>
