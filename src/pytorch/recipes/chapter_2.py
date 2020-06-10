import torch

torch.manual_seed(1234)

# generate random numbers
tensor = torch.randn(4, 4)

print(tensor)

# generate random numbers from uniform distribution
tensor = torch.Tensor(4, 4).uniform_(0, 1)
print(tensor)


tensor = torch.bernoulli(torch.Tensor(4, 4).uniform_(0, 1))
print(tensor)


tensor = torch.multinomial(torch.Tensor(4, 4), 3)
print(tensor)
