# VSCode 配置C++ 调试工具

[annotation]: <id> (1b1ed6ff-325b-4b79-afb6-b8b1e5b6899a)
[annotation]: <status> (public)
[annotation]: <create_time> (2019-04-26 15:54:43)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (C/C++)
[annotation]: <comments> (true)

> 原文链接：<http://blog.ccyg.studio/article/1b1ed6ff-325b-4b79-afb6-b8b1e5b6899a>

---

launch.json

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "g++.exe build and debug active file",
            "type": "cppdbg",
            "request": "launch",
            "program": "D:\\Programming\\workspace\\${fileBasenameNoExtension}.exe",
            "args": [],
            "stopAtEntry": false,
            "cwd": "D:\\Programming\\workspace",
            "environment": [],
            "externalConsole": false,
            "MIMode": "gdb",
            "miDebuggerPath": "D:\\Program Files\\mingw64\\posix\\bin\\gdb.exe",
            "setupCommands": [
                {
                    "description": "Enable pretty-printing for gdb",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                }
            ],
            "preLaunchTask": "g++.exe build active file"
        }
    ]
}
```

tasks.json

```json
{
  "tasks": [
    {
      "type": "shell",
      "label": "g++.exe build active file",
      "command": "D:\\Program Files\\mingw64\\posix\\bin\\g++.exe",
      "args": [
        "-g",
        "${file}",
        "-o",
        "D:\\Programming\\workspace\\${fileBasenameNoExtension}.exe"
      ],
      "options": {
        "cwd": "D:\\Program Files\\mingw64\\posix\\bin"
      }
    }
  ],
  "version": "2.0.0"
}
```

c_cpp_properties.json

```json
{
    "configurations": [
        {
            "name": "Win32",
            "includePath": [
                "${workspaceFolder}/**",
                "D:\\Program Files\\mingw64\\posix\\lib\\gcc\\x86_64-w64-mingw32\\8.1.0\\include\\c++"
            ],
            "defines": [
                "_DEBUG",
                "UNICODE",
                "_UNICODE"
            ],
            "compilerPath": "D:\\Program Files\\mingw64\\posix\\bin\\g++.exe",
            "intelliSenseMode": "gcc-x64",
            "browse": {
                "path": [
                    "${workspaceFolder}"
                ],
                "limitSymbolsToIncludedHeaders": true,
                "databaseFilename": ""
            }
        }
    ],
    "version": 4
}
```