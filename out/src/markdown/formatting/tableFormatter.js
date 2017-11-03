'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// https://help.github.com/articles/organizing-information-with-tables/
const vscode = require("vscode");
function activate(context) {
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('markdown', new MarkdownDocumentFormatter));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
class MarkdownDocumentFormatter {
    provideDocumentFormattingEdits(document, options, token) {
        let edits = [];
        let tables = this.detectTables(document.getText());
        tables.forEach(table => {
            edits.push(new vscode.TextEdit(this.getRange(document, table), this.formatTable(table)));
        });
        return edits;
    }
    detectTables(text) {
        const lineBreak = '\\r?\\n';
        const contentLine = '\\|?.*\\|.*\\|?';
        const hyphenLine = '\\|?[- :\\|]{3,}\\|?';
        const tableRegex = new RegExp(contentLine + lineBreak + hyphenLine + '(?:' + lineBreak + contentLine + ')*', 'g');
        return text.match(tableRegex);
    }
    getRange(document, text) {
        let documentText = document.getText();
        let start = document.positionAt(documentText.indexOf(text));
        let end = document.positionAt(documentText.indexOf(text) + text.length);
        return new vscode.Range(start, end);
    }
    formatTable(text) {
        let rows = text.split(/\r?\n/g);
        let content = rows.map(row => {
            // Escape
            // 1. `|` in code span
            // 2. `\|`
            while (/`([^` ]*?)\|([^` ]*?)`/.test(row)) {
                // Use `while` because there might be more than one `|` in a code span
                row = row.replace(/`([^` ]*?)\|([^` ]*?)`/, '`$1%7c$2`');
            }
            row = row.replace(/\\\|/g, '\\%7c');
            return row.trim().replace(/^\|/g, '').replace(/\|$/g, '').trim().split(/\s*\|\s*/g).map(cell => {
                return cell.replace(/%7c/g, '|');
            });
        });
        // Normalize the num of hyphen
        content[1] = content[1].map(cell => {
            if (/:-+:/.test(cell)) {
                return ':---:';
            }
            else if (/:-+/.test(cell)) {
                return ':---';
            }
            else if (/-+:/.test(cell)) {
                return '---:';
            }
            else if (/-+/.test(cell)) {
                return '---';
            }
        });
        let colWidth = Array(content[0].length).fill(3);
        let cn = /[\u4e00-\u9eff，。《》？；：‘“’”（）【】、—]/g;
        content.forEach(row => {
            row.forEach((cell, i) => {
                // Treat Chinese characters as 2 English characters
                let cellLength = cell.length;
                if (cn.test(cell)) {
                    cellLength += cell.match(cn).length;
                }
                if (colWidth[i] < cellLength) {
                    colWidth[i] = cellLength;
                }
            });
        });
        // Format
        content[1] = content[1].map((cell, i) => {
            if (cell == ':---:') {
                return ':' + '-'.repeat(colWidth[i] - 2) + ':';
            }
            else if (cell == ':---') {
                return ':' + '-'.repeat(colWidth[i] - 1);
            }
            else if (cell == '---:') {
                return '-'.repeat(colWidth[i] - 1) + ':';
            }
            else if (cell == '---') {
                return '-'.repeat(colWidth[i]);
            }
        });
        return content.map(row => {
            let cells = row.map((cell, i) => {
                let cellLength = colWidth[i];
                if (cn.test(cell)) {
                    cellLength -= cell.match(cn).length;
                }
                return (cell + ' '.repeat(cellLength)).slice(0, cellLength);
            });
            return '| ' + cells.join(' | ') + ' |';
        }).join(vscode.workspace.getConfiguration("files").get("eol"));
    }
}
//# sourceMappingURL=tableFormatter.js.map