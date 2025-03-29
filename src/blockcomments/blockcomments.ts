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

// Generate file header comments
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

// Generate function header comments
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

// Get current timestamp
function getTimeStamp(): string {
    const date = new Date();
    const weekList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const year = date.getFullYear().toString();
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return concatWithDelimiter(' ', [
        year + '-' + month + '-' + day,
        date.toLocaleTimeString('en-US', { hour12: false }),
        weekList[date.getDay()]
    ]);
}

// Get the filename for comment insertion
function getActiveFileName(): string {
    return path.basename(vscode.window.activeTextEditor!.document.fileName);
}

// Get file extension and insert comments according to code type
function getActiveFileExtension(): string {
    const fileName = getActiveFileName();
    return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
}

function concatWithDelimiter(delimiter: string, stringList: string[]): string {
    const result = [];
    for (let i = 0; i < stringList.length - 1; ++i) {
        result.push(stringList[i]);
        result.push(delimiter);
    }
    result.push(stringList[stringList.length - 1]);
    return result.join('');
}

function replaceEditorSelection(text: string): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    
    const selections = editor.selections;
    editor.edit(function (editBuilder) {
        selections.forEach(function (selection) {
            editBuilder.replace(selection, '');
            editBuilder.insert(selection.active, text);
        });
    });
} 