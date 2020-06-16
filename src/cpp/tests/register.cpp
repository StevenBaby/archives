#include <iostream>
#include <chrono>

int main(int argc, char const *argv[])
{
    register auto counter = 0;

    // auto counter = 0;
    auto start = std::chrono::steady_clock::now();
    while (counter < 1000000)
    {
        counter++;
    }
    auto end = std::chrono::steady_clock::now();
    std::chrono::duration<double> elapsed = end - start;
    std::cout << "elapsed time: " << elapsed.count() << std::endl;
    return 0;
}
