# VSCode 配置调试工具

[annotation]: [id] (1b1ed6ff-325b-4b79-afb6-b8b1e5b6899a)
[annotation]: [status] (protect)
[annotation]: [create_time] (2019-04-26 15:54:43)
[annotation]: [category] (计算机技术)
[annotation]: [tags] (C/C++)
[annotation]: [comments] (false)
[annotation]: [url] (http://blog.ccyg.studio/article/1b1ed6ff-325b-4b79-afb6-b8b1e5b6899a)

## 预定义变量

- ${workspaceFolder} - the path of the folder opened in VS Code
- ${workspaceFolderBasename} - the name of the folder opened in VS Code without any slashes (/)
- ${file} - the current opened file
- ${fileWorkspaceFolder} - the current opened file's workspace folder
- ${relativeFile} - the current opened file relative to workspaceFolder
- ${relativeFileDirname} - the current opened file's dirname relative to workspaceFolder
- ${fileBasename} - the current opened file's basename
- ${fileBasenameNoExtension} - the current opened file's basename with no file extension
- ${fileDirname} - the current opened file's dirname
- ${fileExtname} - the current opened file's extension
- ${cwd} - the task runner's current working directory on startup
- ${lineNumber} - the current selected line number in the active file
- ${selectedText} - the current selected text in the active file
- ${execPath} - the path to the running VS Code executable
- ${defaultBuildTask} - the name of the default build task
- ${pathSeparator} - the character used by the operating system to separate components in file paths


## 样例

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

## 参考资料

- <https://code.visualstudio.com/docs/editor/variables-reference>
