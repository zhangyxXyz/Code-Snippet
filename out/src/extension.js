'use strict';
const vscode = require("vscode");
var blockcomments = require("./blockcomments/blockcomments");
var dictionary = require("./markdown/extended/dictcompletion");
var mdShortcuts = require("./markdown/shortcuts/commands");
var mdListEditing = require("./markdown/extended/listEditing");
var mdHeadingFormatter = require("./markdown/formatting/headingFormatter");
var mdTableFormatter = require("./markdown/formatting/tableFormatter");
//注册激活各个脚本的事件
function activate(context) {
    blockcomments.register(context);

    // for markdown
    dictionary.activate(context);
    mdShortcuts.register(context);
    mdListEditing.activate(context);
    mdHeadingFormatter.activate(context);
    mdTableFormatter.activate(context);
    vscode.languages.setLanguageConfiguration('markdown', {
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s\，\。\《\》\？\；\：\‘\“\’\”\（\）\【\】\、]+)/g
    });

    return {
        extendMarkdownIt(md) {
            return md.use(require('markdown-it-task-lists'));
        }
    };
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map