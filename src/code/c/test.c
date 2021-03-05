#include <stdio.h>

int main(int argc, char const *argv[])
{
    printf("hello world!!!\n\0");
    return 0;
}

// gcc -m32 test.c -o test
