# coding=utf-8

import torch
from chapter_3_2 import model, t_un, t_c, loss_fn


def main():
    params = torch.tensor([1.0, 0.0], requires_grad=True)

    nepochs = 5000

    learning_rate = 1e-2

    for epoch in range(nepochs):
        t_p = model(t_un, *params)
        loss = loss_fn(t_p, t_c)
        print('Epoch %r, Loss %r' % (epoch, float(loss)))

        if params.grad is not None:
            params.grad.zero_()

        loss.backward()

        params = (params - learning_rate * params.grad).detach().requires_grad_()

    print(params)

if __name__ == '__main__':
    main()
