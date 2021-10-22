# coding=utf-8

def and_gate(x1, x2):
    s = x1 * 1 + x2 * 1
    if s >= 2:
        return 1
    else:
        return 0

# def and_gate(x1, x2):
#     return int(x1 and x2)


def or_gate(x1, x2):
    s = x1 * 1 + x2 * 1
    if s >= 1:
        return 1
    else:
        return 0


def and_not_gate(x1, x2):
    s = x1 * (-1) + x2 * (-1)
    if s >= -1:
        return 1
    else:
        return 0


def not_gate(x):
    return and_not_gate(x, 1)


def xor_gate(x1, x2):
    v1 = and_gate(x1, not_gate(x2))
    v2 = and_gate(not_gate(x1), x2)
    return or_gate(v1, v2)


def main():
    gate = xor_gate
    print(gate(0, 0))
    print(gate(0, 1))
    print(gate(1, 0))
    print(gate(1, 1))

    # print(not_gate(0))
    # print(not_gate(1))


if __name__ == '__main__':
    main()
