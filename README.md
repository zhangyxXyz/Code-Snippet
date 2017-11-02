# Code Snippet
Insert file, or function in the comments section, as well as some snippet of language code.

在文件头部或函数部分插入注释, 以及快速输入一些语言的代码片段。

## Example

1. fileheader
```
/********************************************************
 * @Copyright © http://www.onlyzyx.com
 * @Author: Yunxing Zhang
 * @Date:   2017-11-01 23:30:10 星期三
 * @File:   test.cpp
 * @Description:
********************************************************/
```

2. funcheader
```
/***
    @desc
    @author: Yunxing Zhang
    time:2017-11-01 23:30:18 星期三
    @param:
    @return:
***/
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

1. via system command line
    * in your terminal run the following command
        `code --uninstall-extension codesnippets`

## Configure shortcuts
1. Insert the file Snippet Code Default shortcut is `ctrl + k, ctrl + h`

2. Insert the func Snippet Code Default shortcut is `ctrl + k, ctrl + f`

in your `Code/User/keybindings.json` file add the following:
```
{
    "key": "ctrl+k ctrl+h", // specify shortcut you like here
    "command": "insertfileheader.perform",
    "when": "editorTextFocus"
},
{
    "key": "ctrl+k ctrl+f", // specify shortcut you like here
    "command": "insertfuncheader.perform",
    "when": "editorTextFocus"
}
```

## Author
[Yunxing Zhang](http://www.onlyzyx.com/)

## Thanks
To [Nick Roach](https://www.elegantthemes.com/) for the great icon.