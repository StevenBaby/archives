# coding=utf-8

import torch
from torch import optim
from chapter_3_2 import model, t_u, t_un, t_c, loss_fn


def main():
    params = torch.tensor([1.0, 0.0], requires_grad=True)

    learning_rate = 1e-5

    optimizer = optim.SGD([params], lr=learning_rate)

    t_p = model(t_u, *params)
    loss = loss_fn(t_p, t_c)
    loss.backward()
    optimizer.step()
    print(params)

    params = torch.tensor([1.0, 0.0], requires_grad=True)

    learning_rate = 1e-2

    optimizer = optim.SGD([params], lr=learning_rate)

    t_p = model(t_un, *params)
    loss = loss_fn(t_p, t_c)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    print(params)

    params = torch.tensor([1.0, 0.0], requires_grad=True)

    nepochs = 5000
    learning_rate = 1e-2

    optimizer = optim.SGD([params], lr=learning_rate)

    for epoch in range(nepochs):
        t_p = model(t_un, *params)
        loss = loss_fn(t_p, t_c)
        # print('Epoch %r, Loss %r' % (epoch, float(loss)))
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    t_p = model(t_un, *params)
    print(params)

    from matplotlib import pyplot as plt

    plt.plot(0.1 * t_u.numpy(), t_p.detach().numpy())
    plt.plot(0.1 * t_u.numpy(), t_c.numpy(), "o")
    plt.show()


if __name__ == '__main__':
    main()
