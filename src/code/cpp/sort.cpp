#include <iostream>
#include <random>
#include <ctime>

const int MAX_NUM = 100;
const int MIN_NUM = 10;
const int LENGTH = 32;

void print_array(int array[], int begin, int end)
{
    std::cout << "print array: ";
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
        auto flag = false;
        for (int j = begin + 1; j <= end - i; j++)
        {
            if (array[j - 1] > array[j])
            {
                flag = true;
                temp = array[j - 1];
                array[j - 1] = array[j];
                array[j] = temp;
            }
        }
        if (!flag)
            return;
    }
}

void cocktail_sort(int array[], int begin, int end)
{
    auto left = begin;
    auto right = end;

    while (left < right)
    {
        auto flag = false;
        for (auto i = left; i < right; i++)
        {
            if (array[i] > array[i + 1])
            {
                flag = true;
                auto temp = array[i];
                array[i] = array[i + 1];
                array[i + 1] = temp;
            }
        }
        right--;

        if (!flag)
            return;

        flag = false;
        for (auto i = right; i > left; i--)
        {
            if (array[i] < array[i - 1])
            {
                flag = true;
                auto temp = array[i];
                array[i] = array[i - 1];
                array[i - 1] = temp;
            }
        }
        left++;

        if (!flag)
            return;
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

void adjust_heap(int array[], int begin, int end)
{
    auto dad = begin;
    auto son = dad * 2 + 1;

    while (son <= end)
    {
        if (son + 1 <= end && array[son] < array[son + 1])
            son++;
        if (array[son] < array[dad])
            return;

        auto temp = array[dad];
        array[dad] = array[son];
        array[son] = temp;

        dad = son;
        son = dad * 2 + 1;
    }
}

void heap_sort(int array[], int begin, int end)
{
    for (auto i = (end - begin + 1) / 2 - 1; i >= 0; i--)
        adjust_heap(array, i, end);

    for (auto i = end; i > begin; --i)
    {
        auto temp = array[i];
        array[i] = array[begin];
        array[begin] = temp;
        adjust_heap(array, begin, i - 1);
    }
}

void quick_sort(int array[], int begin, int end)
{
    if (begin >= end)
        return;
    auto pivot = array[begin];

    auto left = begin;
    auto right = end;

    while (left < right)
    {
        while (left < right && array[right] >= pivot)
        {
            right--;
        }
        array[left] = array[right];

        while (left < right && array[left] < pivot)
        {
            left++;
        }
        array[right] = array[left];
    }
    array[left] = pivot;
    quick_sort(array, begin, left - 1);
    quick_sort(array, left + 1, end);
}

void random_quick_sort(int array[], int begin, int end)
{
    if (begin >= end)
        return;

    std::default_random_engine engine(time(nullptr));
    std::uniform_int_distribution<> dis(begin, end);

    auto index = dis(engine);
    auto pivot = array[index];

    auto left = begin;
    auto right = end;

    while (left < right)
    {
        while (left < right && array[right] >= pivot)
        {
            right--;
        }
        array[left] = array[right];

        while (left < right && array[left] < pivot)
        {
            left++;
        }
        array[right] = array[left];
    }
    array[left] = pivot;
    random_quick_sort(array, begin, left - 1);
    random_quick_sort(array, left + 1, end);
}

void merge_sort_recursive(int array[], int begin, int end)
{
    if (begin >= end)
        return;
    auto length = end - begin + 1;
    auto mid = (end - begin) / 2 + begin;

    merge_sort_recursive(array, begin, mid);
    merge_sort_recursive(array, mid + 1, end);

    auto list = new int[length];
    std::copy(array + begin, array + end + 1, list);

    auto begin1 = 0;
    auto end1 = mid - begin;
    auto begin2 = end1 + 1;
    auto end2 = length - 1;

    int index = begin;

    while (begin1 <= end1 && begin2 <= end2)
    {
        if (list[begin1] < list[begin2])
        {
            array[index++] = list[begin1++];
        }
        else
        {
            array[index++] = list[begin2++];
        }
    }
    while (begin1 <= end1)
    {
        array[index++] = list[begin1++];
    }
    while (begin2 <= end2)
    {
        array[index++] = list[begin2++];
    }
    delete[] list;
}

void merge_sort_iterate(int array[], int begin, int end)
{
    if (begin >= end)
        return;

    auto source = array;
    auto length = end - begin + 1;

    array = new int[length];
    auto list = source;

    for (auto segment = 1; segment < length; segment *= 2)
    {
        for (auto i = begin; i <= end; i += segment * 2)
        {
            auto begin1 = i;
            auto begin2 = i + segment;
            auto end1 = begin2 - 1;
            auto end2 = end1 + segment;
            int index = begin1;

            while (begin1 <= end1 && begin2 <= end2)
            {
                if (list[begin1] < list[begin2])
                {
                    array[index++] = list[begin1++];
                }
                else
                {
                    array[index++] = list[begin2++];
                }
            }
            while (begin1 <= end1)
            {
                array[index++] = list[begin1++];
            }
            while (begin2 <= end2)
            {
                array[index++] = list[begin2++];
            }
        }
        auto temp = array;
        array = list;
        list = temp;
    }
    if (array != source)
    {
        std::copy(list + begin, list + end + 1, source);
        list = array;
    }
    delete[] list;
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
    // heap_sort(array, begin, end);
    // quick_sort(array, begin, end);
    // random_quick_sort(array, begin, end);
    // merge_sort_recursive(array, begin, end);
    // merge_sort_iterate(array, begin, end);
    print_array(array, begin, end);
}