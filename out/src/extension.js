'use strict';
const vscode = require("vscode");
const blockcomments = require("./blockcomments/blockcomments");
const dictionary = require("./markdown/extended/dictcompletion");
const mdShortcuts = require("./markdown/shortcuts/commands");
const mdListEditing = require("./markdown/extended/listEditing");
const mdMathCompletion = require("./markdown/extended/completion");
const mdHeadingFormatter = require("./markdown/formatting/headingFormatter");
const mdTableFormatter = require("./markdown/formatting/tableFormatter");
const mdSyntaxDecorations = require("./markdown/extended/syntaxDecorations");
const mdAutoPreview = require("./markdown/extended/preview");
//注册激活各个脚本的事件
function activate(context) {
    blockcomments.register(context);

    // for markdown
    dictionary.activate(context);
    mdShortcuts.register(context);
    mdListEditing.activate(context);
    mdMathCompletion.activate(context);
    mdHeadingFormatter.activate(context);
    mdTableFormatter.activate(context);
    mdSyntaxDecorations.activiate(context);
    mdAutoPreview.activate(context);
    vscode.languages.setLanguageConfiguration('markdown', {
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s\，\。\《\》\？\；\：\‘\“\’\”\（\）\【\】\、]+)/g
    });
    
    return {
        extendMarkdownIt(md) {
            return md.use(require('markdown-it-task-lists'))
                .use(require('@neilsustc/markdown-it-katex'), { "throwOnError": false });
        }
    };
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map