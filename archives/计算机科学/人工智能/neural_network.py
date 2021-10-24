# coding=utf-8

def AND(x1, x2):
    s = x1 * 1 + x2 * 1
    if s >= 2:
        return 1
    else:
        return 0

def OR(x1, x2):
    s = x1 * 1 + x2 * 1
    if s >= 1:
        return 1
    else:
        return 0


def NAND(x1, x2):
    s = x1 * (-1) + x2 * (-1)
    if s >= -1:
        return 1
    else:
        return 0


def XOR(x1, x2):
    s1 = NAND(x1, x2)
    s2 = OR(x1, x2)
    return AND(s1, s2)


def main():
    gate =  XOR
    print(gate(0, 0))
    print(gate(0, 1))
    print(gate(1, 0))
    print(gate(1, 1))

    # print(not_gate(0))
    # print(not_gate(1))


if __name__ == '__main__':
    main()
