'use strict'
var vscode = require('vscode')
var path = require('path')

module.exports = {
    register: register
}

// 获取代码文件头注释
function insertFileHeader() {
    var before = ''
    var after = ''
    var copyRight = ' * @Copyright © ' + vscode.workspace.getConfiguration('codeSnippets.extension').get('copyRight')
    var author = ' * @Author: ' + vscode.workspace.getConfiguration('codeSnippets.extension').get('author')
    var timeStamp = ' * @Date:   ' + getTimeStamp()
    var file = ' * @File:   ' + getActiveFileName()
    var desc = ' * @Description:'
    var changeLog = ' * @ChangeLog:'
    var fileExtension = getActiveFileExtension()

    switch (fileExtension) {
        case 'lua':
            before = '--[========================================================['
            after = '--]========================================================]'
            break
        case 'py':
            before = "'''"
            after = "'''"
            break
        default:
            before = '/********************************************************'
            after = '********************************************************/'
            break
    }
    return concatWithDelimiter('\n', [before, copyRight, author, timeStamp, file, desc, changeLog, after])
}

// 获取代码函数注释
function insertFuncHeader() {
    var before = ''
    var after = ''
    var desc = '  * @desc'
    //var author = "  * @author: " + vscode.workspace.getConfiguration('codeSnippets.extension').get('author');
    var param = '  * @param|:'
    //var timeStamp = "  * @date:" + getTimeStamp();
    var returns = '  * @return:'
    var fileExtension = getActiveFileExtension()

    switch (fileExtension) {
        case 'lua':
            before = '--[=================================['
            after = '--]=================================]'
            break
        case 'py':
            before = "'''"
            after = "'''"
            break
        default:
            before = '/*********************************'
            after = '*********************************/'
            break
    }

    return concatWithDelimiter('\n', [before, desc, /*author, timeStamp,*/ param, returns, after])
}

// 获取当前时间戳
function getTimeStamp() {
    var date = new Date()
    var weekList = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    var year = date.getFullYear().toString()
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    return concatWithDelimiter(' ', [
        year + '-' + month + '-' + day,
        date.toLocaleTimeString('en-US', { hour12: false }),
        weekList[date.getDay()]
    ])
}

// 获取需要插入注释文件名称
function getActiveFileName() {
    return path.basename(vscode.window.activeTextEditor.document.fileName)
}

// 获取需要插入注释文件后缀，按照代码类型插入注释代码
function getActiveFileExtension() {
    var fileName = getActiveFileName()
    return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
}

function concatWithDelimiter(delimiter, stringList) {
    var result = []
    for (var i = 0; i < stringList.length - 1; i++) {
        result.push(stringList[i])
        result.push(delimiter)
    }
    result.push(stringList[stringList.length - 1])
    return result.join('')
}

function replaceEditorSelection(text) {
    var editor = vscode.window.activeTextEditor
    var selections = editor.selections
    editor.edit(function (editBuilder) {
        selections.forEach(function (selection) {
            editBuilder.replace(selection, '')
            editBuilder.insert(selection.active, text)
        })
    })
}

//事件注册
function register(context) {
    var disposable = [
        vscode.commands.registerCommand('insertfileheader.perform', function () {
            var snippet = insertFileHeader()
            replaceEditorSelection(snippet)
        }),
        vscode.commands.registerCommand('insertfuncheader.perform', function () {
            var snippet = insertFuncHeader()
            replaceEditorSelection(snippet)
        }),
        vscode.commands.registerCommand('inserttimemstampr.perform', function () {
            var snippet = getTimeStamp()
            replaceEditorSelection(snippet)
        })
    ]
    ;(_a = context.subscriptions).push.apply(_a, disposable)
    var _a
}
