'use strict';
import * as vscode from 'vscode';
import * as path from 'path';

export function register(context: vscode.ExtensionContext): void {
    const disposable = [
        vscode.commands.registerCommand('insertfileheader.perform', function () {
            const snippet = insertFileHeader();
            replaceEditorSelection(snippet);
        }),
        vscode.commands.registerCommand('insertfuncheader.perform', function () {
            const snippet = insertFuncHeader();
            replaceEditorSelection(snippet);
        }),
        vscode.commands.registerCommand('inserttimemstampr.perform', function () {
            const snippet = getTimeStamp();
            replaceEditorSelection(snippet);
        })
    ];
    
    context.subscriptions.push(...disposable);
}

// 获取代码文件头注释
function insertFileHeader(): string {
    let before = '';
    let after = '';
    const copyRight = ' * @Copyright © ' + vscode.workspace.getConfiguration('codeSnippets.extension').get('copyRight');
    const author = ' * @Author: ' + vscode.workspace.getConfiguration('codeSnippets.extension').get('author');
    const timeStamp = ' * @Date:   ' + getTimeStamp();
    const file = ' * @File:   ' + getActiveFileName();
    const desc = ' * @Description:';
    const changeLog = ' * @ChangeLog:';
    const fileExtension = getActiveFileExtension();

    switch (fileExtension) {
        case 'lua':
            before = '--[===============================================================[';
            after = '--]===============================================================]';
            break;
        case 'py':
            before = "'''";
            after = "'''";
            break;
        default:
            before = '/********************************************************';
            after = '********************************************************/';
            break;
    }
    return concatWithDelimiter('\n', [before, copyRight, author, timeStamp, file, desc, changeLog, after]);
}

// 获取代码函数注释
function insertFuncHeader(): string {
    let before = '';
    let after = '';
    const desc = '  * @desc';
    //const author = "  * @author: " + vscode.workspace.getConfiguration('codeSnippets.extension').get('author');
    const param = '  * @param|:';
    //const timeStamp = "  * @date:" + getTimeStamp();
    const returns = '  * @return:';
    const fileExtension = getActiveFileExtension();

    switch (fileExtension) {
        case 'lua':
            before = '--[==================================[';
            after = '--]==================================]';
            break;
        case 'py':
            before = "'''";
            after = "'''";
            break;
        default:
            before = '/*********************************';
            after = '**********************************/';
            break;
    }

    return concatWithDelimiter('\n', [before, desc, /*author, timeStamp,*/ param, returns, after]);
}

// 获取当前时间戳
function getTimeStamp(): string {
    const date = new Date();
    const weekList = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const year = date.getFullYear().toString();
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return concatWithDelimiter(' ', [
        year + '-' + month + '-' + day,
        date.toLocaleTimeString('en-US', { hour12: false }),
        weekList[date.getDay()]
    ]);
}

// 获取需要插入注释文件名称
function getActiveFileName(): string {
    return path.basename(vscode.window.activeTextEditor!.document.fileName);
}

// 获取需要插入注释文件后缀，按照代码类型插入注释代码
function getActiveFileExtension(): string {
    const fileName = getActiveFileName();
    return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
}

function concatWithDelimiter(delimiter: string, stringList: string[]): string {
    const result = [];
    for (let i = 0; i < stringList.length - 1; i++) {
        result.push(stringList[i]);
        result.push(delimiter);
    }
    result.push(stringList[stringList.length - 1]);
    return result.join('');
}

function replaceEditorSelection(text: string): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    
    const selections = editor.selections;
    editor.edit(function (editBuilder) {
        selections.forEach(function (selection) {
            editBuilder.replace(selection, '');
            editBuilder.insert(selection.active, text);
        });
    });
} 