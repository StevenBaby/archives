#include <iostream>
#include <random>

const int MAX_NUM = 100;
const int MIN_NUM = 10;
const int LENGTH = 32;

void print_array(int array[], int begin, int end)
{
    for (int i = begin; i <= end; ++i)
        std::cout << array[i] << " ";
    std::cout << std::endl;
}

void generate(int array[], int begin, int end)
{
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(MIN_NUM, MAX_NUM);

    for (int n = begin; n <= end; ++n)
        array[n] = dis(gen);
}

void bubble_sort(int array[], int begin, int end)
{
    auto temp = 0;
    for (int i = begin; i <= end; i++)
    {
        for (int j = begin + 1; j <= end - i; j++)
        {
            if (array[j - 1] > array[j])
            {
                temp = array[j - 1];
                array[j - 1] = array[j];
                array[j] = temp;
            }
        }
    }
}

void cocktail_sort(int array[], int begin, int end)
{
    auto left = begin;
    auto right = end;

    while (left < right) {
        for (auto i = left; i < right; i++) {
            if (array[i] > array[i + 1]){
                auto temp = array[i];
                array[i] = array[i + 1];
                array[i + 1] = temp;
            }
        }
        right--;
        for (auto i = right; i > left; i--) {
             if (array[i] < array[i - 1]){
                auto temp = array[i];
                array[i] = array[i - 1];
                array[i - 1] = temp;
            }
        }
        left++;
    }
}


int main()
{
    const auto begin = 0;
    const auto end = LENGTH - 1;

    int array[LENGTH];
    generate(array, begin, end);
    print_array(array, begin, end);
    // bubble_sort(array, begin, end);
    cocktail_sort(array, begin, end);
    print_array(array, begin, end);
}