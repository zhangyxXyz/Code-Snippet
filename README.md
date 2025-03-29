# Code Snippet
Insert file, or function in the comments section(Support C/Cpp,lua..etc ), as well as some snippet of language code.(Only support C/Cpp)

在文件头部或函数部分插入注释, 以及快速输入一些语言的代码片段。特别的会更具代码种类调整注释保证注释在当前语言下合法, 代码片段目前只支持(c/cpp)

## Example

1. fileheader
```
/********************************************************
 * @Copyright © blog: http://xxx.com
 * @Author: Coder
 * @Date:   2017-11-03 07:19:26 星期五
 * @File:   test.cpp
 * @Description:
********************************************************/
```

2. funcheader
```
/***
    @desc
    @author: Coder
    time:2017-11-03 07:19:42 星期五
    @param:
    @return:
***/
```

you can open vscode `setting` change the `Copyright` and `Author` info replace default setting

```
// CopyRight Info in header snipets
"codeSnippets.extension.copyRight": "blog: http://your.domain.com",

//Author Info in block comment snipets
"codeSnippets.extension.author": "Coder"
```

3. snippet

![cpp](./res/img/cppSnippet.png)


## Install (see on [github](https://github.com/zhangyxXyz/Code-Snippet))

dowload or clone the repository from github, choose the file codesnippets.vsix to install.

## Uninstall
There are 2 options to uninstall the extention
1. via VSCode UI
    * open `Extensions` tab in the VS Code sidebar
    * hit "Uninstall" next to **Code Snippet** item.

2. via system command line
    * in your terminal run the following command
        `code --uninstall-extension codesnippets`

## Configure shortcuts
1. Insert the file Snippet Code Default shortcut is `ctrl + k, ctrl + h`

2. Insert the func Snippet Code Default shortcut is `ctrl + k, ctrl + f`

in your `Code/User/keybindings.json` file add the following:
```
{
    "command": "insertfileheader.perform",
    "key": "ctrl+k ctrl+h",
    "mac": "cmd+k cmd+h",
    "when": "editorTextFocus && !suggestWidgetVisible"
},
{
    "command": "insertfuncheader.perform",
    "key": "ctrl+k ctrl+f",
    "mac": "cmd+k cmd+f",
    "when": "editorTextFocus && !suggestWidgetVisible"
}
.....
```

you can change it at keybindings.

## Author
[seiunzhang](https://onlyzyx.com/)

## Thanks
To [Nick Roach](https://www.elegantthemes.com/) for the great icon.