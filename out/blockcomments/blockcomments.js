'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
function register(context) {
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
function insertFileHeader() {
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
function insertFuncHeader() {
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
function getTimeStamp() {
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
function getActiveFileName() {
    return path.basename(vscode.window.activeTextEditor.document.fileName);
}
// 获取需要插入注释文件后缀，按照代码类型插入注释代码
function getActiveFileExtension() {
    const fileName = getActiveFileName();
    return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
}
function concatWithDelimiter(delimiter, stringList) {
    const result = [];
    for (let i = 0; i < stringList.length - 1; i++) {
        result.push(stringList[i]);
        result.push(delimiter);
    }
    result.push(stringList[stringList.length - 1]);
    return result.join('');
}
function replaceEditorSelection(text) {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return;
    const selections = editor.selections;
    editor.edit(function (editBuilder) {
        selections.forEach(function (selection) {
            editBuilder.replace(selection, '');
            editBuilder.insert(selection.active, text);
        });
    });
}
//# sourceMappingURL=blockcomments.js.map