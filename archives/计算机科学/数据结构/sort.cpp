#include <iostream>
#include <random>
#include <ctime>

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
    std::default_random_engine engine(time(nullptr));
    std::uniform_int_distribution<> dis(MIN_NUM, MAX_NUM);

    for (int n = begin; n <= end; ++n)
        array[n] = dis(engine);
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

    while (left < right)
    {
        for (auto i = left; i < right; i++)
        {
            if (array[i] > array[i + 1])
            {
                auto temp = array[i];
                array[i] = array[i + 1];
                array[i + 1] = temp;
            }
        }
        right--;
        for (auto i = right; i > left; i--)
        {
            if (array[i] < array[i - 1])
            {
                auto temp = array[i];
                array[i] = array[i - 1];
                array[i - 1] = temp;
            }
        }
        left++;
    }
}

void select_sort(int array[], int begin, int end)
{
    auto left = begin;
    auto right = end;
    auto max_index = begin;
    for (auto i = end; i >= begin; i--)
    {
        max_index = begin;
        for (auto j = begin + 1; j <= i; j++)
        {
            if (array[j] > array[max_index])
                max_index = j;
        }
        auto temp = array[max_index];
        array[max_index] = array[i];
        array[i] = temp;
    }
}

void quick_sort(int array[], int begin, int end)
{
    if (begin >= end) return;
    auto pivot = array[begin];

    auto left = begin;
    auto right = end;

    while (left < right) {
        while (left < right && array[right] >= pivot) {
            right --;
        }
        array[left] = array[right];

        while (left < right && array[left] < pivot) {
            left ++;
        }
        array[right] = array[left];
    }
    array[left] = pivot;
    quick_sort(array, begin, left - 1);
    quick_sort(array, left + 1, end);
}

void random_quick_sort(int array[], int begin, int end)
{
    if (begin >= end) return;

    std::default_random_engine engine(time(nullptr));
    std::uniform_int_distribution<> dis(begin, end);

    auto index = dis(engine);
    auto pivot = array[index];

    auto left = begin;
    auto right = end;

    while (left < right) {
        while (left < right && array[right] >= pivot) {
            right --;
        }
        array[left] = array[right];

        while (left < right && array[left] < pivot) {
            left ++;
        }
        array[right] = array[left];
    }
    array[left] = pivot;
    random_quick_sort(array, begin, left - 1);
    random_quick_sort(array, left + 1, end);
}

int main()
{
    const auto begin = 0;
    const auto end = LENGTH - 1;

    int array[LENGTH];
    generate(array, begin, end);
    print_array(array, begin, end);
    // bubble_sort(array, begin, end);
    // cocktail_sort(array, begin, end);
    // select_sort(array, begin, end);
    // quick_sort(array, begin, end);
    random_quick_sort(array, begin, end);
    print_array(array, begin, end);
}