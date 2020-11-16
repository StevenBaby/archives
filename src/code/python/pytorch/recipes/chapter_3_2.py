# coding=utf-8
import torch
from chapter_3_1 import t_c, t_u, loss_fn, model
from chapter_3_1 import t_u
from chapter_3_1 import loss_fn


def dloss_fn(t_p, t_c):
    dsq_diffs = 2 * (t_p - t_c)
    return dsq_diffs


def dmodel_dw(t_u, w, b):
    return t_u


def dmodel_db(t_u, w, b):
    return 1.0


def grad_fn(t_u, t_c, t_p, w, b):
    dloss_dw = dloss_fn(t_p, t_c) * dmodel_dw(t_u, w, b)
    dloss_db = dloss_fn(t_p, t_c) * dmodel_db(t_u, w, b)
    return torch.stack([
        dloss_dw.mean(), dloss_db.mean()
    ])


t_un = 0.1 * t_u


def main():

    params = torch.tensor([1.0, 0.0])

    nepochs = 100

    learning_rate = 1e-2

    for epoch in range(nepochs):
        w, b = params
        t_p = model(t_un, w, b)
        loss = loss_fn(t_p, t_c)
        print('Epoch %r, Loss %r' % (epoch, float(loss)))

        grad = grad_fn(t_un, t_c, t_p, w, b)

        print("params:", params)
        print("grad:", grad)
        params -= learning_rate * grad

    print(params)


if __name__ == '__main__':
    main()
