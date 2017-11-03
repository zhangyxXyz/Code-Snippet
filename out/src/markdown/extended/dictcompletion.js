'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
let indexedItems = {};
function activate(context) {
    fs.readFile(context.asAbsolutePath('dictionary.txt'), (err, data) => {
        if (err)
            throw err;
        const indexes = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        indexes.forEach(i => {
            indexedItems[i] = [];
        });
        let words = data.toString().split(/\r?\n/);
        words.forEach(word => {
            let firstLetter = word.charAt(0).toLowerCase();
            indexedItems[firstLetter].push(new vscode.CompletionItem(word, vscode.CompletionItemKind.Text));
        });
    });
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('markdown', new DictionaryCompletionItemProvider("markdown")));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('latex', new DictionaryCompletionItemProvider("latex")));
}
exports.activate = activate;
/**
 * Provide completion according to the first letter
 */
class DictionaryCompletionItemProvider {
    constructor(fileType) {
        this.fileType = fileType;
    }
    provideCompletionItems(document, position, token) {
        let textBefore = document.lineAt(position.line).text.substring(0, position.character);
        let firstLetter;
        // [2017.03.24] Found that this function is only invoked when you begin a new word.
        // It means that currentWord.length === 1 when invoked.
        // (If you have not set the trigger chars)
        switch (this.fileType) {
            case "markdown":
                textBefore = textBefore.replace(/\W/g, ' ');
                firstLetter = textBefore.split(/[\s]+/).pop().charAt(0);
                return this.completeByFirstLetter(firstLetter);
            case "latex":
                // `|` means cursor
                // \command
                if (/\\[^{\[]*$/.test(textBefore)) {
                    return new Promise((resolve, reject) => reject());
                }
                // \begin[...|] or \begin{...}[...|]
                if (/\\(documentclass|usepackage|begin|end|cite|ref)({[^}]*}|)?\[[^\]]*$/.test(textBefore)) {
                    return new Promise((resolve, reject) => reject());
                }
                // \begin{...|} or \begin[...]{...|}
                if (/\\(documentclass|usepackage|begin|end|cite|ref)(\[[^\]]*\]|)?{[^}]*$/.test(textBefore)) {
                    return new Promise((resolve, reject) => reject());
                }
                textBefore = textBefore.replace(/\W/g, ' ');
                firstLetter = textBefore.split(/[\s]+/).pop().charAt(0);
                return this.completeByFirstLetter(firstLetter);
        }
    }
    completeByFirstLetter(firstLetter) {
        if (firstLetter.toLowerCase() == firstLetter) {
            return new Promise((resolve, reject) => resolve(indexedItems[firstLetter]));
        }
        else {
            let completions = indexedItems[firstLetter.toLowerCase()]
                .map(w => {
                    let newLabel = w.label.charAt(0).toUpperCase() + w.label.slice(1);
                    return new vscode.CompletionItem(newLabel, vscode.CompletionItemKind.Text);
                });
            return new Promise((resolve, reject) => resolve(completions));
        }
    }
}
//# sourceMappingURL=completion.js.map